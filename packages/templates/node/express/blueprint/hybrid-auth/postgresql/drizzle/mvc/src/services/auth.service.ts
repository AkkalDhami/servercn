import { NextFunction } from "express";
import db from "../configs/db";
import { users } from "../drizzle/schemas/user.schema";
import { eq } from "drizzle-orm";
import { ApiError } from "../utils/api-error";
import { hashPassword, verifyPassword } from "../helpers/auth.helpers";
import { SignupUserType, VerifyOtpType } from "../validators/auth";
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
} from "../constants/auth";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from "../utils/jwt";
import {
  generateHashedToken,
  generateOTP,
  generateSecureToken,
  generateUUID
} from "../helpers/token.helpers";
import { RefreshTokenData, SessionData } from "../types/user";
import { OtpService } from "./otp.service";
import { deleteFileFromCloudinary } from "./cloudinary.service";
import redisClient from "../configs/redis";
import { logger } from "../utils/logger";
import env from "../configs/env";
import { sendEmail } from "../utils/send-mail";
import { getRemainingTime } from "../utils/date";

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
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

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

      await redisClient.set(indexKey, hashCode, {
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

    const [user] = await db.insert(users).values({
      name,
      email: userEmail,
      role,
      password,
      isEmailVerified: true
    }).returning();

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
      const user = await db.query.users.findFirst({
        where: eq(users.email, email)
      });
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

        await db.update(users).set({
          failedLoginAttempts: newAttempts,
          lockUntil
        }).where(eq(users.id, user.id));

        throw ApiError.unauthorized("Invalid credentials");
      }

      await db.update(users).set({
        failedLoginAttempts: 0,
        lockUntil: null
      }).where(eq(users.id, user.id));

      await AuthService.handleToken(
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

  static async handleToken(
    user: { _id: string; role: "user" | "admin" } & {
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
      _id: user._id,
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

    await db.update(users).set({
      lastLoginAt: new Date(),
      failedLoginAttempts: 0,
      lockUntil: null
    }).where(eq(users.id, user._id));
  }

  static async getUserProfile(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });
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
    const sessionKey = `session:${decodedRefresh.sessionId}`;

    await redisClient.watch(refreshTokenKey, sessionKey);

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

      if (
        userId !== decodedRefresh._id ||
        tokenHash !== refreshTokenHash
      ) {
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

      const user = await db.query.users.findFirst({
        where: eq(users.id, decodedRefresh._id)
      });
      if (!user) {
        throw ApiError.unauthorized("User not found.");
      }

      const newAccessToken = generateAccessToken({
        _id: user.id,
        role: user.role as "user" | "admin",
        sessionId: storedSessionData.sessionId
      });

      const newRefreshToken = generateRefreshToken({
        _id: user.id,
        sessionId: storedSessionData.sessionId
      });
      const newRefreshTokenHash = generateHashedToken(newRefreshToken);

      const refreshTokenData: RefreshTokenData = {
        userId: user.id,
        tokenHash: newRefreshTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
      };
      const sessionData: SessionData = {
        userId: user.id,
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
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
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

  static async getUserSessions(userId: string, currentSessionId: string) {
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

  static async deleteSession(userId: string, sessionId: string) {
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

  static async deleteAllUserSessions(userId: string) {
    const userSessionsKey = `user_sessions:${userId}`;
    const sessionIds = await redisClient.sMembers(userSessionsKey);
    
    if (sessionIds.length > 0) {
      for (const sessionId of sessionIds) {
        const sessionKey = `session:${sessionId}`;
        const sessionData = await redisClient.get(sessionKey);
        if (sessionData) {
            const session = JSON.parse(sessionData) as SessionData;
            const refreshTokenKey = `refreshToken:${session.refreshTokenHash}`;
            await redisClient.del(refreshTokenKey);
        }
        await redisClient.del(sessionKey);
      }
      await redisClient.del(userSessionsKey);
    }
  }

  static async resetPassword(
    next: NextFunction,
    email: string,
    newPassword: string
  ) {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      throw (
        ApiError.forbidden(
          `Your account has been locked. Please try again after ${
            getRemainingTime(user.lockUntil).minutes
          } minutes and ${getRemainingTime(user.lockUntil).seconds} seconds.`
        )
      );
    }

    if (user.failedLoginAttempts >= LOGIN_MAX_ATTEMPTS && user.lockUntil) {
      throw (
        ApiError.forbidden(
          `You have exceeded the maximum number of login attempts. Please try again after ${
            getRemainingTime(user.lockUntil).minutes
          } minutes and ${getRemainingTime(user.lockUntil).seconds} seconds.`
        )
      );
    }

    if (!user.isEmailVerified) {
      throw ApiError.unauthorized("Please verify your email first.");
    }

    const redisKey = `reset_password:status:${email}`;
    const status = await redisClient.get(redisKey);
    if (status !== "pending") {
      throw (
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
      throw ApiError.badRequest("New password should be different!");
    }

    const hashedPassword = await hashPassword(newPassword);
    await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email));
    await redisClient.del(`reset_password:status:${email}`);

    //? Delete all user sessions
    await this.deleteAllUserSessions(user.id);

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
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });
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
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));

    await this.deleteAllUserSessions(userId);

    return {
      message: "Password changed successfully. Please login again!"
    };
  }

  static async requestDeleteAccount(userId: string, password: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });
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

      await db.update(users).set({
        failedLoginAttempts: newAttempts,
        lockUntil
      }).where(eq(users.id, user.id));
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
    logger.info({ userId }, "Delete account email queued");
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
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });
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

      await db.update(users).set({
        isDeleted: true,
        deletedAt: new Date(),
        reActivateAvailableAt: new Date(Date.now() + REACTIVATION_AVAILABLE_AT)
      }).where(eq(users.id, userId));
      await AuthService.deleteAllUserSessions(userId);
    } else if (type === "hard") {
      if ((user.avatar as any)?.public_id) {
        await deleteFileFromCloudinary([(user.avatar as any).public_id]);
      }
      await db.delete(users).where(eq(users.id, userId));
      await AuthService.deleteAllUserSessions(userId);
    }
  }

  static async reactivateAccount(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });
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

    await db.update(users).set({
      isDeleted: false,
      deletedAt: null,
      reActivateAvailableAt: null
    }).where(eq(users.id, userId));
  }
}
