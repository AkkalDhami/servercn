import { eq } from "drizzle-orm";
import {
  ChangePasswordType,
  DeleteAccountType,
  ResetPasswordType,
  SigninUserType,
  SignupUserType,
  VerifyOtpType
} from "./auth.validator";
import { ApiError } from "../../shared/utils/api-error";
import { hashPassword, verifyPassword } from "./auth.helpers";
import {
  LOCK_TIME_MS,
  LOGIN_MAX_ATTEMPTS,
  OTP_CODE_LENGTH,
  OTP_EXPIRES_IN,
  REACTIVATION_AVAILABLE_AT,
  REFRESH_TOKEN_EXPIRY
} from "./auth.constants";
import { refreshTokens, users } from "../../drizzle";
import { OtpService } from "../otp/otp.service";
import {
  generateHashedToken,
  generateOTP
} from "../../shared/helpers/token.helpers";
import redis from "../../shared/configs/redis";
import db from "../../shared/configs/db";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from "../../shared/utils/jwt";
import { IUser } from "./auth.types";
import {
  deleteFileFromCloudinary,
  uploadToCloudinary
} from "../upload/cloudinary.service";

export type CookieOptionsType = {
  setAuthCookie?: (accessToken: string, refreshToken: string) => void;
};

export class AuthService {
  static async signupUser(user: SignupUserType) {
    const { name, email, password, role } = user;
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      throw ApiError.conflict("User already exists with this email");
    }

    await OtpService.checkOtpRestrictions(email);
    await OtpService.trackOtpRequests(email);
    const hashedPassword = await hashPassword(password);
    const { code, hashCode } = generateOTP(OTP_CODE_LENGTH);

    const redisKey = `user:${email}:${hashCode}`;

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
      hashCode
    });

    await redis.set(redisKey, userData, {
      EX: OTP_EXPIRES_IN / 1000
    });

    return;
  }

  static async verifyUser({ email, code }: VerifyOtpType) {
    const hashCode = generateHashedToken(code);

    await OtpService.verifyOtp(hashCode, email);

    const userData = await redis.get(`user:${email}:${hashCode}`);

    if (!userData) {
      throw ApiError.badRequest("Invalid or expired otp");
    }

    const { name, email: userEmail, role, password } = JSON.parse(userData);

    const [existingUser] = await db
      .insert(users)
      .values({
        name,
        email: userEmail,
        role,
        password,
        isEmailVerified: true
      })
      .$returningId();

    await redis.del(`user:${email}:${hashCode}`);

    return {
      id: existingUser.id,
      name,
      email,
      role: role || "user",
      isEmailVerified: true
    };
  }

  static async loginUser(user: SigninUserType, setCookie: CookieOptionsType) {
    const { email, password } = user;
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!existingUser) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    if (!existingUser.isEmailVerified) {
      throw ApiError.unauthorized("Email not verified");
    }

    if (existingUser.lockUntil && new Date() < existingUser.lockUntil) {
      throw ApiError.forbidden(
        `Your account has been locked. Please try again after ${Math.ceil((existingUser.lockUntil.getTime() - Date.now()) / (1000 * 60))} minutes.`
      );
    }

    const isPasswordValid = await verifyPassword(
      password,
      existingUser.password || ""
    );

    if (!isPasswordValid) {
      let lockUntil = null;

      let newAttempts = existingUser.failedLoginAttempts + 1;

      if (newAttempts >= LOGIN_MAX_ATTEMPTS) {
        lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      }

      await db
        .update(users)
        .set({
          failedLoginAttempts: newAttempts,
          lockUntil
        })
        .where(eq(users.id, existingUser.id));

      throw ApiError.unauthorized("Invalid credentials");
    }

    await db
      .update(users)
      .set({
        failedLoginAttempts: 0,
        lockUntil: null,
        lastLoginAt: new Date()
      })
      .where(eq(users.id, existingUser.id));

    await AuthService.handleUserToken(
      {
        id: existingUser.id,
        role: existingUser.role
      },
      setCookie
    );

    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      isEmailVerified: existingUser.isEmailVerified
    };
  }

  static async getUserProfile(userId: number) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt
    };
  }

  static async updateUserProfile(
    userId: number,
    { name, avatar }: { name: string; avatar?: Express.Multer.File | undefined }
  ) {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    if (!existingUser) {
      throw ApiError.unauthorized("Unauthorized");
    }

    if (existingUser?.avatar?.public_id) {
      await deleteFileFromCloudinary([existingUser.avatar.public_id]);
    }

    let avatarUrl;

    if (avatar?.buffer) {
      const file = await uploadToCloudinary(avatar.buffer, {
        folder: "uploads/files",
        resource_type: "auto"
      });
      avatarUrl = file.url;

      await db
        .update(users)
        .set({
          avatar: {
            public_id: file.public_id,
            url: file.url,
            size: file.size
          }
        })
        .where(eq(users.id, userId));
    }

    if (name) {
      await db.update(users).set({ name }).where(eq(users.id, userId));
    }

    return {
      name,
      email: existingUser.email,
      role: existingUser.role,
      avatar: avatarUrl,
      isEmailVerified: existingUser.isEmailVerified,
      lastLoginAt: existingUser.lastLoginAt
    };
  }

  static async handleUserToken(
    user: Pick<IUser, "id" | "role">,
    context: CookieOptionsType
  ) {
    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role
    });

    const newRefreshToken = generateRefreshToken(user.id);

    const hashedNewRefreshToken = generateHashedToken(newRefreshToken);

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: hashedNewRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    });

    context.setAuthCookie &&
      context.setAuthCookie(accessToken, newRefreshToken);
  }

  static async refreshTokens(accessToken: string, refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.unauthorized("Unauthorized, please login.");
    }

    const decodedRefresh = verifyRefreshToken(refreshToken);
    if (!decodedRefresh?.userId) {
      throw ApiError.unauthorized("Invalid refresh token.");
    }

    const refreshTokenHash = generateHashedToken(refreshToken);

    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, refreshTokenHash));

    // Reuse detection
    if (!storedToken) {
      await db
        .update(refreshTokens)
        .set({ isRevoked: true, revokedAt: new Date() })
        .where(eq(refreshTokens.tokenHash, refreshTokenHash));
      throw ApiError.unauthorized("Token reuse detected. Please login again.");
    }
    if (storedToken.isRevoked) {
      throw ApiError.unauthorized("Refresh token revoked.");
    }

    if (storedToken.expiresAt < new Date()) {
      throw ApiError.unauthorized("Refresh token expired.");
    }

    if (accessToken) {
      const decodedAccess = verifyAccessToken(accessToken);
      if (decodedAccess.id !== decodedRefresh.userId) {
        throw ApiError.unauthorized("Token mismatch.");
      }
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decodedRefresh.userId));

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      role: user.role
    });

    const newRefreshToken = generateRefreshToken(user.id);

    const hashedNewRefreshToken = generateHashedToken(newRefreshToken);

    await db
      .update(refreshTokens)
      .set({
        isRevoked: true,
        revokedAt: new Date(),
        replacedByTokenHash: hashedNewRefreshToken
      })
      .where(eq(refreshTokens.tokenHash, refreshTokenHash));

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: hashedNewRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  static async forgotPassword(email: string) {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!existingUser) {
      throw ApiError.badRequest(
        "If this email is registered, check your inbox."
      );
    }

    await OtpService.checkOtpRestrictions(email);
    await OtpService.trackOtpRequests(email);

    const { code, hashCode } = generateOTP(OTP_CODE_LENGTH);

    await OtpService.sendOtp({
      name: existingUser.name,
      email,
      templateName: "forgot-password",
      code,
      hashCode
    });
  }

  static async verifyForgotPasswordOtp({ code, email }: VerifyOtpType) {
    const hashCode = generateHashedToken(code);
    await OtpService.verifyOtp(hashCode, email);
    const redisKey = `forgot-password:${email}`;
    await redis.set(redisKey, "true", {
      EX: 60 * 5 // 5 minutes
    });
  }

  static async resetPassword({ email, newPassword }: ResetPasswordType) {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!existingUser) {
      throw ApiError.badRequest(
        "If this email is registered, check your inbox."
      );
    }

    const redisKey = `forgot-password:${email}`;
    const isResetTokenValid = await redis.get(redisKey);
    if (!isResetTokenValid) {
      throw ApiError.badRequest("Invalid or expired reset token.");
    }

    const isOldPassword = await verifyPassword(
      newPassword,
      existingUser.password || ""
    );

    if (isOldPassword) {
      throw ApiError.badRequest(`New password cannot be same as old password.`);
    }

    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedPassword
      })
      .where(eq(users.email, email));

    await redis.del(redisKey);
  }

  static async logoutUser(userId: number) {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  static async changePassword(
    userId: number,
    { oldPassword, newPassword }: ChangePasswordType
  ) {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!existingUser) {
      throw ApiError.unauthorized("Unauthorized");
    }

    if (!existingUser.isEmailVerified) {
      throw ApiError.unauthorized("Please verify your email first.");
    }

    const isPasswordValid = await verifyPassword(
      oldPassword,
      existingUser.password || ""
    );

    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const isOldPassword = await verifyPassword(
      newPassword,
      existingUser.password || ""
    );

    if (isOldPassword) {
      throw ApiError.badRequest(`New password cannot be same as old password.`);
    }

    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedPassword
      })
      .where(eq(users.id, userId));
  }

  static async deleteAccount({ userId, type }: DeleteAccountType) {
    if (type === "soft") {
      await db
        .update(users)
        .set({
          isDeleted: true,
          deletedAt: new Date(),
          reActivateAvailableAt: new Date(
            Date.now() + REACTIVATION_AVAILABLE_AT
          )
        })
        .where(eq(users.id, userId));
    } else {
      await db.delete(users).where(eq(users.id, userId));
    }
  }

  static async reactivateAccount(userId: number) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      throw ApiError.unauthorized("Unauthorized, user not found");
    }

    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      throw ApiError.badRequest(
        `Your account has been locked. Please try again after ${Math.ceil(
          (user.lockUntil.getTime() - Date.now()) / (1000 * 60)
        )} minutes.`
      );
    }

    if (!user?.isDeleted || !user?.deletedAt) {
      throw ApiError.badRequest("Your account is already active!");
    }

    if (
      user?.reActivateAvailableAt &&
      new Date(user?.reActivateAvailableAt) > new Date()
    ) {
      throw ApiError.unauthorized(
        `Reactivation not available yet. Please try again after ${Math.ceil(
          (user.reActivateAvailableAt.getTime() - Date.now()) / (1000 * 60)
        )} minutes.`
      );
    }

    await db
      .update(users)
      .set({
        isDeleted: false,
        deletedAt: null,
        reActivateAvailableAt: null
      })
      .where(eq(users.id, userId));
  }
}
