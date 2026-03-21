import { NextFunction } from "express";
import User from "./user.model";
import { ApiError } from "../../shared/utils/api-error";
import { hashPassword, verifyPassword } from "./auth.helpers";
import { SignupUserType, VerifyOtpType } from "./auth.validator";
import {
  DELETE_ACCOUNT_TOKEN_EXPIRY,
  LOCK_TIME_MS,
  LOGIN_MAX_ATTEMPTS,
  OTP_CODE_LENGTH,
  OTP_EXPIRES_IN,
  REACTIVATION_AVAILABLE_AT,
  REFRESH_TOKEN_EXPIRY,
  RESET_PASSWORD_TOKEN_EXPIRY,
  SESSION_EXPIRY
} from "./auth.constants";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from "../../shared/utils/jwt";
import {
  generateHashedToken,
  generateOTP,
  generateSecureToken,
  generateUUID
} from "../../shared/helpers/token.helpers";
import { IUser, RefreshTokenData, SessionData } from "./auth.types";
import { OtpService } from "../otp/otp.service";
import { deleteFileFromCloudinary } from "../upload/upload.service";
import redisClient from "../../shared/configs/redis";
import { logger } from "../../shared/utils/logger";
import env from "../../shared/configs/env";
import { sendEmail } from "../../shared/utils/send-mail";
import { getRemainingTime } from "../../shared/utils/date";

export type CookieOptionsType = {
  setAuthCookie?: (
    accessToken: string,
    refreshToken: string,
    sessionId: string
  ) => void;
};

export class AuthService {
  static async registerUser(user: Omit<SignupUserType, "confirmPassword">) {
    try {
      const { name, email, password, role } = user;
      const existingUser = await User.findOne({
        email
      }).select("+password");

      if (existingUser) {
        throw ApiError.conflict("User with this email already exists");
      }

      const pending = await redisClient.get(`user:pending:${email}`);

      if (pending) {
        throw ApiError.conflict(
          "Signup already in progress. Check your email for OTP."
        );
      }

      const hashedPassword = await hashPassword(password);

      await OtpService.checkOtpRestrictions(email);
      await OtpService.trackOtpRequests(email);

      const { code, hashCode } = generateOTP(OTP_CODE_LENGTH);

      const redisKey = `user:${email}:${hashCode}`;
      const indexKey = `user:pending:${email}`;
      await redisClient.set(indexKey, hashCode, {
        expiration: {
          type: "PX",
          value: OTP_EXPIRES_IN
        }
      });
      const userData = JSON.stringify({
        name,
        email,
        role,
        password: hashedPassword
      });

      await OtpService.sendOtp({
        name,
        email,
        templateName: "email-verification",
        code,
        hashCode,
        subject: "Email Verification"
      });

      await redisClient.set(redisKey, userData, {
        expiration: {
          type: "PX",
          value: OTP_EXPIRES_IN
        }
      });
    } catch (error) {
      logger.error(error, "Failed to register user");
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.server("Failed to register user");
    }
  }

  static async verifyUser({ email, otpCode }: VerifyOtpType) {
    const hashCode = generateHashedToken(otpCode);

    await OtpService.verifyOtp(hashCode, email);

    const userData = await redisClient.get(`user:${email}:${hashCode}`);

    if (!userData) {
      throw ApiError.badRequest("Invalid or expired otp");
    }

    const { name, email: userEmail, role, password } = JSON.parse(userData);

    const user = await User.create({
      name,
      email: userEmail,
      role,
      password,
      isEmailVerified: true
    });

    await redisClient.del(`user:${email}:${hashCode}`);
    await redisClient.del(`user:pending:${email}`);

    return {
      _id: user._id,
      name,
      email,
      role: role,
      isEmailVerified: true
    };
  }

  static async signinUser(
    {
      email,
      password,
      ip,
      userAgent
    }: {
      email: string;
      password: string;
      ip: string;
      userAgent: string;
    },
    setCookie: CookieOptionsType
  ) {
    try {
      const user = await User.findOne({
        email
      }).select("+password");
      if (!user) {
        throw ApiError.unauthorized("Invalid credentials");
      }

      if (!user.isEmailVerified) {
        throw ApiError.unauthorized("Email not verified");
      }

      if (user.lockUntil && new Date() < user.lockUntil) {
        throw ApiError.forbidden(
          `Your account has been locked. Please try again after ${getRemainingTime(user.lockUntil).minutes} minutes and ${getRemainingTime(user.lockUntil).seconds} seconds.`
        );
      }

      const isPasswordValid = await verifyPassword(
        password,
        user.password || ""
      );
      if (!isPasswordValid) {
        let lockUntil = null;

        let newAttempts = user.failedLoginAttempts + 1;

        if (newAttempts >= LOGIN_MAX_ATTEMPTS) {
          lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        }

        await User.updateOne(
          {
            _id: user._id
          },
          {
            failedLoginAttempts: newAttempts,
            lockUntil
          }
        );

        throw ApiError.unauthorized("Invalid credentials");
      }

      await User.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            failedLoginAttempts: 0
          },
          $unset: {
            lockUntil: 1
          }
        }
      );

      await AuthService.handleToken(
        {
          _id: user._id.toString(),
          role: user.role,
          ip,
          userAgent
        },
        setCookie
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      };
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw ApiError.server("Signin failed");
    }
  }

  static async handleToken(
    user: Pick<IUser, "_id" | "role"> & {
      ip: string;
      userAgent: string;
    },
    context: CookieOptionsType
  ) {
    const sessionId = generateUUID();

    const accessToken = generateAccessToken({
      _id: user._id,
      role: user.role,
      sessionId
    });

    const refreshToken = generateRefreshToken({
      _id: user._id.toString(),
      sessionId
    });

    const hashedRefreshToken = generateHashedToken(refreshToken);

    const refreshTokenData: RefreshTokenData = {
      userId: user._id,
      tokenHash: hashedRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    };

    const sessionData: SessionData = {
      userId: user._id,
      sessionId,
      refreshTokenHash: hashedRefreshToken,
      userAgent: user.userAgent,
      ip: user.ip,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + SESSION_EXPIRY)
    };

    const refreshTokenKey = `refreshToken:${hashedRefreshToken}`;

    await redisClient.set(refreshTokenKey, JSON.stringify(refreshTokenData), {
      expiration: {
        type: "PX",
        value: REFRESH_TOKEN_EXPIRY
      }
    });

    const sessionKey = `session:${sessionId}`;

    const userSessionsKey = `user_sessions:${user._id}`;

    await redisClient.set(sessionKey, JSON.stringify(sessionData), {
      expiration: {
        type: "PX",
        value: SESSION_EXPIRY
      }
    });

    // add sessionId to user's set
    await redisClient.sAdd(userSessionsKey, sessionId);

    context.setAuthCookie &&
      context.setAuthCookie(accessToken, refreshToken, sessionId);

    await User.updateOne(
      {
        _id: user._id
      },
      {
        $set: {
          lastLogin: new Date(),
          failedLoginAttempts: 0
        },
        $unset: {
          lockUntil: 1
        }
      }
    );
  }

  static async getUserProfile(userId: string) {
    const user = await User.findById(userId);
    return user;
  }

  static async refreshTokens(accessToken: string | null, refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.unauthorized("Unauthorized, please login.");
    }

    const decodedRefresh = verifyRefreshToken(refreshToken);

    if (!decodedRefresh?._id) {
      throw ApiError.unauthorized("Invalid refresh token.");
    }

    const refreshTokenHash = generateHashedToken(refreshToken);

    const refreshTokenKey = `refreshToken:${refreshTokenHash}`;

    const storedToken = await redisClient.get(refreshTokenKey);
    if (!storedToken) {
      throw ApiError.unauthorized("Invalid refresh token.");
    }

    const { userId, tokenHash, expiresAt } = JSON.parse(
      storedToken
    ) as RefreshTokenData;

    if (userId !== decodedRefresh._id) {
      throw ApiError.unauthorized("Invalid refresh token.");
    }

    // Reuse detection
    if (!storedToken) {
      throw ApiError.unauthorized("Token reuse detected. Please login again.");
    }

    if (expiresAt < new Date()) {
      throw ApiError.unauthorized("Refresh token expired.");
    }

    const session = await redisClient.get(
      `session:${decodedRefresh.sessionId}`
    );

    if (!session) {
      throw ApiError.unauthorized("Session not found.");
    }

    const storedSessionData = JSON.parse(session) as SessionData;

    if (
      decodedRefresh.sessionId !== storedSessionData.sessionId ||
      decodedRefresh._id !== storedSessionData.userId
    ) {
      throw ApiError.unauthorized("Token-session mismatch");
    }

    if (accessToken) {
      const decodedAccess = verifyAccessToken(accessToken);
      if (decodedAccess._id !== decodedRefresh._id) {
        throw ApiError.unauthorized("Token mismatch.");
      }
    }

    const user = await User.findById(decodedRefresh._id);
    if (!user) {
      throw ApiError.unauthorized("User not found.");
    }

    const newAccessToken = generateAccessToken({
      _id: user._id.toString(),
      role: user.role,
      sessionId: storedSessionData.sessionId
    });

    const newRefreshToken = generateRefreshToken({
      _id: user._id.toString(),
      sessionId: storedSessionData.sessionId
    });
    const newRefreshTokenHash = generateHashedToken(newRefreshToken);

    //? Rotate token
    await Promise.all([
      redisClient.del(`refreshToken:${tokenHash}`),
      redisClient.del(`session:${storedSessionData.sessionId}`)
    ]);

    const refreshTokenData: RefreshTokenData = {
      userId: user._id.toString(),
      tokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    };
    const sessionData: SessionData = {
      userId: user._id.toString(),
      sessionId: storedSessionData.sessionId,
      refreshTokenHash: newRefreshTokenHash,
      userAgent: storedSessionData.userAgent,
      ip: storedSessionData.ip,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + SESSION_EXPIRY)
    };

    const newRefreshTokenKey = `refreshToken:${newRefreshTokenHash}`;
    const newSessionKey = `session:${storedSessionData.sessionId}`;

    await Promise.all([
      redisClient.set(newRefreshTokenKey, JSON.stringify(refreshTokenData), {
        expiration: {
          type: "PX",
          value: REFRESH_TOKEN_EXPIRY
        }
      }),
      redisClient.set(newSessionKey, JSON.stringify(sessionData), {
        expiration: {
          type: "PX",
          value: SESSION_EXPIRY
        }
      })
    ]);

    //? delete old refresh token
    await redisClient.del(refreshTokenKey);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      sessionId: storedSessionData.sessionId
    };
  }

  static async logoutUser(userId: string, sessionId: string) {
    const sessionKey = `session:${sessionId}`;
    const sessionData = await redisClient.get(sessionKey);
    const userSessionsKey = `user_sessions:${userId}`;
    if (!sessionData) {
      throw ApiError.unauthorized("Session not found.");
    }

    const session = JSON.parse(sessionData) as SessionData;

    if (session.userId !== userId) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    const refreshTokenKey = `refreshToken:${session.refreshTokenHash}`;

    await redisClient.del(sessionKey);
    await redisClient.del(refreshTokenKey);
    await redisClient.sRem(userSessionsKey, sessionId);
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({
      email
    });

    if (!user) {
      throw ApiError.badRequest(
        "If an account exists, a reset code has been sent."
      );
    }

    const { code, hashCode } = generateOTP(OTP_CODE_LENGTH);

    await OtpService.checkOtpRestrictions(email);
    await OtpService.trackOtpRequests(email);

    const redisKey = `reset_password:${email}:${hashCode}`;

    await redisClient.set(redisKey, hashCode, {
      expiration: {
        type: "PX",
        value: RESET_PASSWORD_TOKEN_EXPIRY
      }
    });

    await OtpService.sendOtp({
      email,
      subject: "Password Reset",
      templateName: "forgot-password",
      name: user.name,
      code,
      hashCode
    });
  }

  static async verifyResetPasswordOtp(otpCode: string, email: string) {
    const hashedCode = generateHashedToken(otpCode);

    const redisKey = `reset_password:${email}:${hashedCode}`;
    const storedHashCode = await redisClient.get(redisKey);
    if (!storedHashCode) {
      throw ApiError.unauthorized("Invalid or expired otp");
    }
    await OtpService.verifyOtp(storedHashCode, email);

    await redisClient.del(`reset_password:${email}:${hashedCode}`);
    await redisClient.set(`reset_password:status:${email}`, "pending", {
      expiration: {
        type: "PX",
        value: RESET_PASSWORD_TOKEN_EXPIRY
      }
    });
  }

  static async resetPassword(
    next: NextFunction,
    email: string,
    newPassword: string
  ) {
    const user = await User.findOne({
      email
    }).select("+password");

    if (!user) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      return next(
        ApiError.forbidden(
          `Your account has been locked. Please try again after ${
            getRemainingTime(user.lockUntil).minutes
          } minutes and ${getRemainingTime(user.lockUntil).seconds} seconds.`
        )
      );
    }

    if (user.failedLoginAttempts >= LOGIN_MAX_ATTEMPTS && user.lockUntil) {
      return next(
        ApiError.forbidden(
          `You have exceeded the maximum number of login attempts. Please try again after ${
            getRemainingTime(user.lockUntil).minutes
          } minutes and ${getRemainingTime(user.lockUntil).seconds} seconds.`
        )
      );
    }

    if (!user.isEmailVerified) {
      return next(ApiError.unauthorized("Please verify your email first."));
    }

    const redisKey = `reset_password:status:${email}`;
    const status = await redisClient.get(redisKey);
    if (status !== "pending") {
      return next(
        ApiError.unauthorized(
          "Please request a password reset before attempting to set a new password."
        )
      );
    }

    const oldPassword = user.password;

    const isOldPassword = await verifyPassword(
      newPassword,
      oldPassword as string
    );

    if (isOldPassword) {
      return next(ApiError.badRequest("New password should be different!"));
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.updateOne(
      {
        email
      },
      {
        $set: {
          password: hashedPassword
        }
      }
    );
    await redisClient.del(`reset_password:status:${email}`);

    //? Delete all user sessions
    await this.deleteAllUserSessions(user._id.toString());

    return {
      message: "Password reset successfully. Please login!"
    };
  }

  static async changePassword(
    next: NextFunction,
    {
      newPassword,
      oldPassword,
      userId
    }: {
      userId: string;
      newPassword: string;
      oldPassword: string;
    }
  ) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    if (!user.isEmailVerified) {
      return next(ApiError.unauthorized("Please verify your email first."));
    }

    const isOldPassword = await verifyPassword(
      oldPassword,
      user.password || ""
    );

    if (!isOldPassword) {
      return next(ApiError.unauthorized("Invalid credentials"));
    }

    if (newPassword === oldPassword) {
      return next(ApiError.badRequest("New password should be different!"));
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.updateOne(
      {
        _id: userId
      },
      {
        $set: {
          password: hashedPassword
        }
      }
    );

    await this.deleteAllUserSessions(userId);

    return {
      message: "Password changed successfully. Please login again!"
    };
  }

  static async requestDeleteAccount(userId: string, password: string) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    const isPasswordValid = await verifyPassword(password, user.password || "");

    if (!isPasswordValid) {
      let lockUntil = null;

      let newAttempts = user.failedLoginAttempts + 1;

      if (newAttempts >= LOGIN_MAX_ATTEMPTS) {
        lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      }

      await User.updateOne(
        {
          _id: user._id
        },
        {
          failedLoginAttempts: newAttempts,
          lockUntil
        }
      );
      throw ApiError.unauthorized("Invalid credentials");
    }

    const token = generateSecureToken();
    const hashedToken = generateHashedToken(token);

    const redisKey = `delete_account:token:${userId}`;

    if (await redisClient.get(redisKey)) {
      throw ApiError.badRequest("Delete account token already requested!");
    }

    await redisClient.set(redisKey, hashedToken, {
      expiration: {
        type: "PX",
        value: DELETE_ACCOUNT_TOKEN_EXPIRY
      }
    });

    const deleteAccountUrl = `${env.CLIENT_URL}/account/delete?token=${token}`;
    logger.warn(`Delete account token: ${token}`);
    await sendEmail({
      email: user.email,
      subject: "Delete Account Request",
      templateName: "delete-account",
      data: {
        name: user.name,
        deleteAccountUrl
      }
    });
  }

  static async deleteOrDeactiveAccount({
    userId,
    type,
    token
  }: {
    userId: string;
    type: "soft" | "hard";
    token: string;
  }) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    const redisKey = `delete_account:token:${userId}`;
    const storedToken = await redisClient.get(redisKey);
    if (!storedToken) {
      throw ApiError.badRequest("Invalid or expired token!");
    }

    const isTokenValid = generateHashedToken(token) === storedToken;
    if (!isTokenValid) {
      throw ApiError.badRequest("Invalid or expired token!");
    }

    await redisClient.del(redisKey);

    if (type === "soft") {
      user.isDeleted = true;
      user.deletedAt = new Date();
      user.reActivateAvailableAt = new Date(
        Date.now() + REACTIVATION_AVAILABLE_AT
      );
      await user.save();
      await this.deleteAllUserSessions(userId);
    } else if (type === "hard") {
      if (user?.avatar?.public_id) {
        await deleteFileFromCloudinary([user.avatar.public_id]);
      }
      await User.findOneAndDelete({
        _id: userId
      });
      await this.deleteAllUserSessions(userId);
      await user.save();
    }
  }

  static async reactivateAccount(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      const remainingTime = getRemainingTime(user.lockUntil);
      throw ApiError.badRequest(
        `Your account has been locked. Please try again after ${remainingTime.minutes} minutes and ${remainingTime.seconds} seconds.`
      );
    }

    if (!user?.isDeleted || !user?.deletedAt) {
      throw ApiError.badRequest("Your account is already active!");
    }

    if (
      user?.reActivateAvailableAt &&
      new Date(user?.reActivateAvailableAt) > new Date()
    ) {
      throw ApiError.forbidden(
        `Your account has been locked. Please try again after ${
          getRemainingTime(user.reActivateAvailableAt).minutes
        } minutes and ${getRemainingTime(user.reActivateAvailableAt).seconds} seconds.`
      );
    }

    await User.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
          reActivateAvailableAt: null
        }
      },
      {
        new: true
      }
    );

    await user.save();
  }

  static async getUserSessions(userId: string, currentSid: string) {
    const sessionIds = await redisClient.sMembers(`user_sessions:${userId}`);

    const sessions = await Promise.all(
      sessionIds.map(async id => {
        const data = await redisClient.get(`session:${id}`);
        return data ? JSON.parse(data) : null;
      })
    );

    const filteredData = sessions
      .filter(Boolean)
      .map((session: SessionData) => {
        return {
          sessionId: session.sessionId,
          userAgent: session.userAgent,
          ip: session.ip,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          current: session.sessionId === currentSid
        };
      });

    return filteredData;
  }

  static async deleteUserSession(userId: string, sessionId: string) {
    const sessionKey = `session:${sessionId}`;
    const userSessionsKey = `user_sessions:${userId}`;
    const sessionData = await redisClient.get(sessionKey);

    if (!sessionData) {
      throw ApiError.unauthorized("Session not found.");
    }

    const session = JSON.parse(sessionData) as SessionData;

    if (session.userId !== userId) {
      throw ApiError.unauthorized("Unauthorized access");
    }
    const refreshTokenKey = `refreshToken:${session.refreshTokenHash}`;
    await redisClient.del(sessionKey);
    await redisClient.del(refreshTokenKey);
    await redisClient.sRem(userSessionsKey, sessionId);
  }

  static async deleteAllUserSessions(userId: string) {
    const userSessionsKey = `user_sessions:${userId}`;
    const sessionIds = await redisClient.sMembers(userSessionsKey);
    if (sessionIds.length) {
      const keys = sessionIds.map(id => `session:${id}`);
      await redisClient.del(keys);
    }
    await redisClient.del(userSessionsKey);
  }
}
