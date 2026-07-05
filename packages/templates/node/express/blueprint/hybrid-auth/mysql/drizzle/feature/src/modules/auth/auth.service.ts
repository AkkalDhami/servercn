import { NextFunction } from "express";
import db from "@/shared/configs/db";
import { users } from "@/db/schemas/user.schema";
import { eq } from "drizzle-orm";
import { ApiError } from "@/shared/utils/api-error";
import { hashPassword, verifyPassword } from "@/modules/auth/auth.helpers";
import { SignupUserType, VerifyOtpType } from "./auth.validation";
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
} from "@/shared/utils/jwt";
import {
  generateHashedToken,
  generateOTP,
  generateSecureToken,
  generateUUID
} from "@/shared/helpers/token.helpers";
import { AvatarData, RefreshTokenData, SessionData } from "./auth.interfaces";
import { otpService, OtpService } from "../otp/otp.service";
import { deleteFileFromCloudinary } from "../upload/upload.service";
import redisClient from "@/shared/configs/redis";
import { logger } from "@/shared/utils/logger";
import env from "@/shared/configs/env";
import { sendEmail } from "@/shared/utils/send-mail";
import { getRemainingTime } from "@/shared/utils/date";
import { AuthRepository, authRepository } from "./auth.repository";
import { CookieOptionsType, UserSigninType } from "./auth.types";

export class AuthService {
  constructor(
    private repo: AuthRepository,
    private otpService: OtpService
  ) {}

  private async ensureUserChecks() {}

  async registerUser(user: Omit<SignupUserType, "confirmPassword">) {
    try {
      const { name, email, password, role } = user;
      const existingUser = await this.repo.findUserByEmail(email);

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
      await this.otpService.checkOtpRestrictions(email);
      await this.otpService.trackOtpRequests(email);

      const { code, hashCode } = generateOTP(OTP_CODE_LENGTH);

      const redisKey = `user:${email}:${hashCode}`;
      const indexKey = `user:pending:${email}`;
      const userData = JSON.stringify({
        name,
        email,
        role,
        password: hashedPassword
      });

      await this.otpService.sendOtp({
        name,
        email,
        templateName: "email-verification",
        code,
        hashCode,
        subject: "Email Verification"
      });

      try {
        await redisClient.set(redisKey, userData, {
          expiration: {
            type: "PX",
            value: OTP_EXPIRES_IN
          }
        });

        await redisClient.set(indexKey, hashCode, {
          expiration: {
            type: "PX",
            value: OTP_EXPIRES_IN
          }
        });
      } catch (error) {
        await Promise.allSettled([
          redisClient.del(redisKey),
          redisClient.del(indexKey),
          redisClient.del(`otp:${email}`),
          redisClient.del(`otp_cooldown:${email}`)
        ]);

        throw error;
      }
    } catch (error) {
      logger.error(error, "Failed to register user");
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.server("Failed to register user");
    }
  }

  async verifyUser({ email, otpCode }: VerifyOtpType) {
    const hashCode = generateHashedToken(otpCode);

    await this.otpService.verifyOtp(hashCode, email);

    const userData = await redisClient.get(`user:${email}:${hashCode}`);

    if (!userData) {
      throw ApiError.badRequest("Invalid or expired otp");
    }

    const { name, email: userEmail, role, password } = JSON.parse(userData);

    const user = await this.repo.createNewUser({
      name,
      email: userEmail,
      role,
      password
    });

    await redisClient.del(`user:${email}:${hashCode}`);
    await redisClient.del(`user:pending:${email}`);

    return {
      _id: user.id,
      name,
      email,
      role: role,
      isEmailVerified: true
    };
  }

  async signinUser(
    { email, password, ip, userAgent }: UserSigninType,
    setCookie: CookieOptionsType
  ) {
    try {
      const user = await this.repo.findUserByEmail(email);

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

        await this.repo.updateLoginAttempts({
          id: user.id,
          lockUntil,
          failedLoginAttempts: newAttempts
        });
        throw ApiError.unauthorized("Invalid credentials");
      }

      await this.repo.updateLoginAttempts({
        id: user.id,
        lockUntil: null,
        failedLoginAttempts: 0
      });

      await this.handleToken(
        {
          _id: user.id,
          role: user.role as "user" | "admin",
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

  async handleToken(
    user: { _id: number; role: "user" | "admin" } & {
      ip: string;
      userAgent: string;
    },
    context: CookieOptionsType
  ) {
    const sessionId = generateUUID();

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      role: user.role,
      sessionId
    });

    const refreshToken = generateRefreshToken({
      _id: user._id.toString(),
      sessionId
    });

    const hashedRefreshToken = generateHashedToken(refreshToken);

    const refreshTokenData: RefreshTokenData = {
      userId: user._id.toString(),
      tokenHash: hashedRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    };

    const sessionData: SessionData = {
      userId: user._id.toString(),
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

    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockUntil: null
      })
      .where(eq(users.id, user._id));
  }

  async getUserProfile(userId: string) {
    const user = await this.repo.findUserById(parseInt(userId));

    return user;
  }

  async refreshTokens(accessToken: string | null, refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.unauthorized("Unauthorized, please login.");
    }

    const decodedRefresh = verifyRefreshToken(refreshToken);

    if (!decodedRefresh?._id) {
      throw ApiError.unauthorized("Invalid refresh token.");
    }

    const refreshTokenHash = generateHashedToken(refreshToken);

    const refreshTokenKey = `refreshToken:${refreshTokenHash}`;
    const sessionKey = `session:${decodedRefresh.sessionId}`;

    await redisClient.watch([refreshTokenKey, sessionKey]);

    try {
      const [storedToken, session] = await Promise.all([
        redisClient.get(refreshTokenKey),
        redisClient.get(sessionKey)
      ]);

      if (!storedToken) {
        throw ApiError.unauthorized("Invalid refresh token.");
      }

      const { userId, tokenHash, expiresAt } = JSON.parse(
        storedToken
      ) as RefreshTokenData;

      if (userId !== decodedRefresh._id || tokenHash !== refreshTokenHash) {
        throw ApiError.unauthorized("Invalid refresh token.");
      }

      if (new Date(expiresAt) < new Date()) {
        throw ApiError.unauthorized("Refresh token expired.");
      }

      if (!session) {
        throw ApiError.unauthorized("Session not found.");
      }

      const storedSessionData = JSON.parse(session) as SessionData;

      if (
        decodedRefresh.sessionId !== storedSessionData.sessionId ||
        decodedRefresh._id !== storedSessionData.userId ||
        storedSessionData.refreshTokenHash !== refreshTokenHash
      ) {
        throw ApiError.unauthorized("Token-session mismatch");
      }

      if (accessToken) {
        try {
          const decodedAccess = verifyAccessToken(accessToken);
          if (decodedAccess._id !== decodedRefresh._id) {
            throw ApiError.unauthorized("Token mismatch.");
          }
        } catch (e) {
          // Access token might be expired, which is normal for a refresh flow
        }
      }

      const user = await this.repo.findUserById(parseInt(decodedRefresh._id));
      if (!user) {
        throw ApiError.unauthorized("User not found.");
      }

      const newAccessToken = generateAccessToken({
        _id: user.id.toString(),
        role: user.role as "user" | "admin",
        sessionId: storedSessionData.sessionId
      });

      const newRefreshToken = generateRefreshToken({
        _id: user.id.toString(),
        sessionId: storedSessionData.sessionId
      });
      const newRefreshTokenHash = generateHashedToken(newRefreshToken);

      const refreshTokenData: RefreshTokenData = {
        userId: user.id.toString(),
        tokenHash: newRefreshTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
      };
      const sessionData: SessionData = {
        userId: user.id.toString(),
        sessionId: storedSessionData.sessionId,
        refreshTokenHash: newRefreshTokenHash,
        userAgent: storedSessionData.userAgent,
        ip: storedSessionData.ip,
        createdAt: storedSessionData.createdAt,
        expiresAt: new Date(Date.now() + SESSION_EXPIRY)
      };

      const newRefreshTokenKey = `refreshToken:${newRefreshTokenHash}`;
      const transaction = redisClient.multi();

      transaction.del(`refreshToken:${tokenHash}`);
      transaction.set(newRefreshTokenKey, JSON.stringify(refreshTokenData), {
        expiration: {
          type: "PX",
          value: REFRESH_TOKEN_EXPIRY
        }
      });
      transaction.set(sessionKey, JSON.stringify(sessionData), {
        expiration: {
          type: "PX",
          value: SESSION_EXPIRY
        }
      });

      const transactionResult = await transaction.exec();

      if (!transactionResult) {
        throw ApiError.unauthorized("Refresh token already rotated.");
      }

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionId: storedSessionData.sessionId
      };
    } finally {
      await redisClient.unwatch();
    }
  }

  async logoutUser(userId: string, sessionId: string) {
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

  async forgotPassword(email: string) {
    const user = await this.repo.findUserByEmail(email);

    if (!user) {
      return;
    }

    const { code, hashCode } = generateOTP(OTP_CODE_LENGTH);

    await this.otpService.checkOtpRestrictions(email);
    await this.otpService.trackOtpRequests(email);

    const redisKey = `reset_password:${email}:${hashCode}`;

    await redisClient.set(redisKey, hashCode, {
      expiration: {
        type: "PX",
        value: RESET_PASSWORD_TOKEN_EXPIRY
      }
    });

    await this.otpService.sendOtp({
      email,
      subject: "Password Reset",
      templateName: "forgot-password",
      name: user.name,
      code,
      hashCode
    });
  }

  async verifyResetPasswordOtp(otpCode: string, email: string) {
    const hashedCode = generateHashedToken(otpCode);

    const redisKey = `reset_password:${email}:${hashedCode}`;
    const storedHashCode = await redisClient.get(redisKey);
    if (!storedHashCode) {
      throw ApiError.unauthorized("Invalid or expired otp");
    }
    await this.otpService.verifyOtp(storedHashCode, email);

    await redisClient.del(`reset_password:${email}:${hashedCode}`);
    await redisClient.set(`reset_password:status:${email}`, "pending", {
      expiration: {
        type: "PX",
        value: RESET_PASSWORD_TOKEN_EXPIRY
      }
    });
  }

  async getUserSessions(userId: string, currentSessionId: string) {
    const userSessionsKey = `user_sessions:${userId}`;
    const sessionIds = await redisClient.sMembers(userSessionsKey);

    const sessions = [];
    for (const sessionId of sessionIds) {
      const sessionKey = `session:${sessionId}`;
      const sessionData = await redisClient.get(sessionKey);
      if (sessionData) {
        const session = JSON.parse(sessionData) as SessionData;
        sessions.push({
          ...session,
          isCurrent: sessionId === currentSessionId
        });
      }
    }

    return sessions;
  }

  async deleteSession(userId: string, sessionId: string) {
    const sessionKey = `session:${sessionId}`;
    const sessionData = await redisClient.get(sessionKey);
    const userSessionsKey = `user_sessions:${userId}`;

    if (!sessionData) {
      throw ApiError.notFound("Session not found.");
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

  async deleteAllUserSessions(userId: string) {
    const userSessionsKey = `user_sessions:${userId}`;
    const sessionIds = await redisClient.sMembers(userSessionsKey);

    if (sessionIds.length === 0) {
      return;
    }

    const sessions = await Promise.all(
      sessionIds.map(async sessionId => {
        const sessionKey = `session:${sessionId}`;
        const sessionData = await redisClient.get(sessionKey);

        return {
          sessionKey,
          session: sessionData ? (JSON.parse(sessionData) as SessionData) : null
        };
      })
    );

    await Promise.all(
      sessions.flatMap(({ sessionKey, session }) => {
        const deletions = [redisClient.del(sessionKey)];

        if (session?.refreshTokenHash) {
          deletions.push(
            redisClient.del(`refreshToken:${session.refreshTokenHash}`)
          );
        }

        return deletions;
      })
    );

    await redisClient.del(userSessionsKey);
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.repo.findUserByEmail(email);

    if (!user) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      throw ApiError.forbidden(
        `Your account has been locked. Please try again after ${
          getRemainingTime(user.lockUntil).minutes
        } minutes and ${getRemainingTime(user.lockUntil).seconds} seconds.`
      );
    }

    if (user.failedLoginAttempts >= LOGIN_MAX_ATTEMPTS && user.lockUntil) {
      throw ApiError.forbidden(
        `You have exceeded the maximum number of login attempts. Please try again after ${
          getRemainingTime(user.lockUntil).minutes
        } minutes and ${getRemainingTime(user.lockUntil).seconds} seconds.`
      );
    }

    if (!user.isEmailVerified) {
      throw ApiError.unauthorized("Please verify your email first.");
    }

    const redisKey = `reset_password:status:${email}`;
    const status = await redisClient.get(redisKey);
    if (status !== "pending") {
      throw ApiError.unauthorized(
        "Please request a password reset before attempting to set a new password."
      );
    }

    const oldPassword = user.password;

    const isOldPassword = await verifyPassword(
      newPassword,
      oldPassword as string
    );

    if (isOldPassword) {
      throw ApiError.badRequest("New password should be different!");
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.repo.updatePassword({
      email,
      password: hashedPassword
    });

    await redisClient.del(`reset_password:status:${email}`);

    //? Delete all user sessions
    await this.deleteAllUserSessions(user.id.toString());

    return {
      message: "Password reset successfully. Please login!"
    };
  }

  async changePassword({
    newPassword,
    oldPassword,
    userId
  }: {
    userId: string;
    newPassword: string;
    oldPassword: string;
  }) {
    const user = await this.repo.findUserById(parseInt(userId));

    if (!user) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    if (!user.isEmailVerified) {
      throw ApiError.unauthorized("Please verify your email first.");
    }

    const isOldPassword = await verifyPassword(
      oldPassword,
      user.password || ""
    );

    if (!isOldPassword) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    if (newPassword === oldPassword) {
      throw ApiError.badRequest("New password should be different!");
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.repo.updatePassword({
      email: user.email,
      password: hashedPassword
    });

    await this.deleteAllUserSessions(userId);

    return {
      message: "Password changed successfully. Please login again!"
    };
  }

  async requestDeleteAccount(userId: string, password: string) {
    const user = await this.repo.findUserById(parseInt(userId));
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

      await this.repo.updateLoginAttempts({
        id: user.id,
        failedLoginAttempts: newAttempts,
        lockUntil
      });
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
    logger.info({ userId, token }, "Delete account email queued");
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

  async deleteOrDeactiveAccount({
    userId,
    type,
    token
  }: {
    userId: string;
    type: "soft" | "hard";
    token: string;
  }) {
    const user = await this.repo.findUserById(parseInt(userId));

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
      await this.repo.updateUserActivation({
        id: parseInt(userId),
        isDeleted: true,
        deletedAt: new Date(),
        reActivateAvailableAt: new Date(Date.now() + REACTIVATION_AVAILABLE_AT)
      });
      await this.deleteAllUserSessions(userId);
    } else if (type === "hard") {
      const avatar = user.avatar as AvatarData | string | null | undefined;

      if (avatar && typeof avatar !== "string" && avatar.public_id) {
        await deleteFileFromCloudinary([avatar.public_id]);
      }
      await db.delete(users).where(eq(users.id, parseInt(userId)));
      await this.deleteAllUserSessions(userId);
    }
  }

  async reactivateAccount(userId: string) {
    const user = await this.repo.findUserById(parseInt(userId));
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

    await this.repo.updateUserActivation({
      id: parseInt(userId),
      isDeleted: false,
      deletedAt: null,
      reActivateAvailableAt: null
    });
  }
}

export const authService = new AuthService(authRepository, otpService);
