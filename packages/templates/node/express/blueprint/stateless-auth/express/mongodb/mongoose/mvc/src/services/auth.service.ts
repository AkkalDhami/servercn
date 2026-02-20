import { NextFunction } from "express";
import User from "../models/user.model";
import { ApiError } from "../utils/api-error";
import { hashPassword, verifyPassword } from "../helpers/auth.helpers";
import { SigninUserType, SignupUserType } from "../validators/auth";
import {
  LOCK_TIME_MS,
  LOGIN_MAX_ATTEMPTS,
  REACTIVATION_AVAILABLE_AT,
  REFRESH_TOKEN_EXPIRY
} from "../constants/auth";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from "../utils/jwt";
import RefreshToken from "../models/refresh-token.model";
import {
  generateHashedToken,
  generateTokenAndHashedToken,
  generateUUID
} from "../helpers/token.helpers";
import { IUser } from "../types/user";
import mongoose from "mongoose";
import { OtpService } from "./otp.service";
import { deleteFileFromCloudinary } from "./cloudinary.service";

export type Context = {
  setAuthCookie?: (accessToken: string, refreshToken: string) => void;
};

export class AuthService {
  static async registerUser(
    next: NextFunction,
    user: Omit<SignupUserType, "confirmPassword">
  ) {
    const { name, email, password, role } = user;
    const existingUser = await User.findOne({ email }).select("+password");

    if (existingUser) {
      return next(ApiError.conflict("User with this email already exists"));
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return newUser;
  }

  static async loginAndSendOtp(
    next: NextFunction,
    { email, password }: { email: string; password: string }
  ) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const user = await User.findOne({ email })
        .session(session)
        .select("+password");
      if (!user) {
        await session.abortTransaction();
        return next(ApiError.unauthorized("Invalid credentials"));
      }

      if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
        await session.abortTransaction();
        return next(
          ApiError.forbidden(
            `Your account has been locked. Please try again after ${Math.ceil(
              (user.lockUntil.getTime() - Date.now()) / (1000 * 60)
            )} minutes.`
          )
        );
      }

      const isPasswordValid = await verifyPassword(
        password,
        user.password || ""
      );

      if (!isPasswordValid) {
        let lockUntil = null;

        const newAttempts = user.failedLoginAttempts + 1;

        if (newAttempts >= LOGIN_MAX_ATTEMPTS) {
          lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        }

        await User.updateOne(
          { email },
          {
            $set: {
              failedLoginAttempts: newAttempts,
              lockUntil
            }
          }
        );
        await session.abortTransaction();
        return next(ApiError.unauthorized("Invalid credentials"));
      }

      const otp = await OtpService.sendOtp(next, {
        email,
        otpType: "signin",
        subject: "Signin"
      });

      if (!otp) {
        await session.abortTransaction();
        return next(ApiError.server("Failed to generate OTP"));
      }

      await session.commitTransaction();
      session.endSession();

      return {
        message: otp.message
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return next(ApiError.server("Signin failed"));
    }
  }

  static async handleToken(
    user: Pick<IUser, "isEmailVerified" | "_id" | "role">,
    context: Context
  ) {
    if (!user.isEmailVerified) {
      await User.updateOne(
        { _id: user._id },
        { $set: { isEmailVerified: true } }
      );
    }

    const accessToken = generateAccessToken({
      _id: user._id,
      role: user.role
    });

    const refreshToken = generateRefreshToken(user._id);

    const hashedRefreshToken = generateHashedToken(refreshToken);

    await RefreshToken.create({
      userId: user._id,
      tokenHash: hashedRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    });

    context.setAuthCookie && context.setAuthCookie(accessToken, refreshToken);

    await User.updateOne(
      { _id: user._id },
      {
        $set: { lastLogin: new Date(), failedLoginAttempts: 0 },
        $unset: { lockUntil: 1 }
      }
    );
    return { message: "OTP verified and user signed in successfully" };
  }

  static async getUserProfile(userId: string) {
    const user = await User.findById(userId);
    return user;
  }

  static async refreshTokens(
    next: NextFunction,
    accessToken: string | null,
    refreshToken: string
  ) {
    if (!refreshToken) {
      return next(ApiError.unauthorized("Unauthorized, please login."));
    }

    const decodedRefresh = verifyRefreshToken(refreshToken);
    if (!decodedRefresh?.userId) {
      return next(ApiError.unauthorized("Invalid refresh token."));
    }

    const refreshTokenHash = generateHashedToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
      userId: decodedRefresh.userId,
      tokenHash: refreshTokenHash
    });

    // Reuse detection
    if (!storedToken) {
      await RefreshToken.updateMany(
        { userId: decodedRefresh.userId },
        { isRevoked: true, revokedAt: new Date() }
      );
      return next(
        ApiError.unauthorized("Token reuse detected. Please login again.")
      );
    }

    if (storedToken.isRevoked) {
      return next(ApiError.unauthorized("Refresh token revoked."));
    }

    if (storedToken.expiresAt < new Date()) {
      return next(ApiError.unauthorized("Refresh token expired."));
    }

    if (accessToken) {
      const decodedAccess = verifyAccessToken(accessToken);
      if (decodedAccess._id !== decodedRefresh.userId) {
        return next(ApiError.unauthorized("Token mismatch."));
      }
    }

    const user = await User.findById(decodedRefresh.userId);
    if (!user) {
      return next(ApiError.unauthorized("User not found."));
    }

    const newAccessToken = generateAccessToken({
      _id: user._id.toString(),
      role: user.role
    });

    const newRefreshToken = generateRefreshToken(user._id.toString());
    const newRefreshTokenHash = generateHashedToken(newRefreshToken);

    //? Rotate token
    storedToken.isRevoked = true;
    storedToken.revokedAt = new Date();
    storedToken.replacedByTokenHash = newRefreshTokenHash;
    await storedToken.save();

    await RefreshToken.create({
      userId: user._id,
      tokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  static async logoutUser(userId: string) {
    return await RefreshToken.updateMany(
      { userId },
      { isRevoked: true, revokedAt: new Date() }
    );
  }

  static async forgotPassword(next: NextFunction, email: string) {
    const user = await User.findOne({ email });

    if (!user) {
      return next(
        ApiError.badRequest("If this email is registered, check your inbox.")
      );
    }

    const result = await OtpService.sendOtp(next, {
      email,
      otpType: "password-reset",
      subject: "Password Reset"
    });

    if (!result) {
      return next(ApiError.server("Failed to send otp!"));
    }

    return result;
  }

  static async resetPassword(
    next: NextFunction,
    email: string,
    newPassword: string
  ) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      return next(
        ApiError.forbidden(
          `Your account has been locked. Please try again after ${Math.ceil(
            (user.lockUntil.getTime() - Date.now()) / (1000 * 60)
          )} minutes.`
        )
      );
    }

    if (user.failedLoginAttempts >= LOGIN_MAX_ATTEMPTS && user.lockUntil) {
      return next(
        ApiError.forbidden(
          `You have exceeded the maximum number of login attempts. Please try again after ${Math.ceil(
            (user.lockUntil.getTime() - Date.now()) / (1000 * 60)
          )} minutes.`
        )
      );
    }

    if (!user.isEmailVerified) {
      return next(ApiError.unauthorized("Please verify your email first."));
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
      { email },
      {
        $set: {
          password: hashedPassword,
          isEmailVerified: true
        }
      }
    );
    return { message: "Password reset successfully!" };
  }

  static async changePassword(
    next: NextFunction,
    {
      newPassword,
      oldPassword,
      userId
    }: { userId: string; newPassword: string; oldPassword: string }
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
      { _id: userId },
      {
        $set: {
          password: hashedPassword
        }
      }
    );
    return { message: "Password changed successfully. Please login again!" };
  }

  static async deleteOrDeactiveAccount(
    next: NextFunction,
    userId: string,
    type: "soft" | "hard"
  ) {
    const user = await User.findById(userId);
    if (!user) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    if (type === "soft") {
      user.isDeleted = true;
      user.deletedAt = new Date();
      user.reActivateAvailableAt = new Date(
        Date.now() + REACTIVATION_AVAILABLE_AT
      );
      await user.save();
    } else if (type === "hard") {
      if (user?.avatar?.public_id) {
        await deleteFileFromCloudinary([user.avatar.public_id]);
      }
      await User.findOneAndDelete({ _id: userId });
      await user.save();
    }
  }

  static async reactivateAccount(next: NextFunction, userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      return next(
        ApiError.badRequest(
          `Your account has been locked. Please try again after ${Math.ceil(
            (user.lockUntil.getTime() - Date.now()) / (1000 * 60)
          )} minutes.`
        )
      );
    }

    if (!user?.isDeleted || !user?.deletedAt) {
      return next(ApiError.badRequest("Your account is already active!"));
    }

    if (
      user?.reActivateAvailableAt &&
      new Date(user?.reActivateAvailableAt) > new Date()
    ) {
      return next(
        ApiError.forbidden(
          `Your account has been locked. Please try again after ${Math.ceil(
            (user.reActivateAvailableAt.getTime() - Date.now()) / (1000 * 60)
          )} minutes.`
        )
      );
    }

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
          reActivateAvailableAt: null
        }
      },
      { new: true }
    );

    await user.save();
  }
}
