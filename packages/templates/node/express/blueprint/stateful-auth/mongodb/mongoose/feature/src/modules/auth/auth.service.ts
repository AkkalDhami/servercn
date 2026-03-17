import { NextFunction } from "express";
import { SignupUserType } from "./auth.validation";
import {
  LOGIN_MAX_ATTEMPTS,
  MAX_SESSIONS_PER_USER,
  REACTIVATION_AVAILABLE_AT,
  SESSION_EXPIRES_IN
} from "./auth.constants";

import mongoose from "mongoose";
import { OtpService } from "../otp/otp.service";
import { deleteFileFromCloudinary } from "../upload/upload.service";
import env from "../../shared/configs/env";
import { ApiError } from "@/shared/utils/api-error";
import User from "./user.model";
import Session from "./session.model";
import {
  generateHashedToken,
  generateSecureToken
} from "@/shared/helpers/token.helpers";
import { SendMail, sendEmail } from "@/shared/utils/send-mail";
import { hashPassword, verifyPassword } from "@/shared/helpers/auth.helpers";
import { IUser } from "./auth.types";

export type Context = {
  setAuthCookie?: (token: string) => void;
  ip?: string;
  userAgent?: string;
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

      const isPasswordValid = await verifyPassword(
        password,
        user.password || ""
      );
      if (!isPasswordValid) {
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
    user: Pick<IUser, "isEmailVerified" | "_id" | "role" | "email">,
    context: Context
  ) {
    if (!user.isEmailVerified) {
      await User.updateOne(
        { _id: user._id },
        { $set: { isEmailVerified: true } }
      );
    }

    if (context.userAgent) {
      const existingDevice = await Session.findOne({
        userId: user._id,
        userAgent: context.userAgent
      });

      const isNewDevice = !existingDevice;
      if (isNewDevice) {
        const html = `
        <p>New sign-in to your account from a new device or browser.</p>
        <p>This could be a sign of a possible security threat.</p>
        <p> 
          <strong>Device:</strong> ${context.userAgent}<br/>
          <strong>IP Address:</strong> ${context.ip || "Unknown"}<br/>
          <strong>Time:</strong> ${new Date().toDateString()}<br/>
        </p>
        <p>If this was you, you can safely ignore this email. If not, please secure your account immediately.</p>
        `;

        await sendEmail({
          from: env.EMAIL_FROM,
          email: user.email,
          subject: "New Sign-in Alert",
          html
        } as SendMail);
      }
    }

    const token = generateSecureToken();
    const hashedToken = generateHashedToken(token);
    const activeSessions = await Session.countDocuments({
      userId: user._id,
      isActive: true
    });

    if (activeSessions >= MAX_SESSIONS_PER_USER) {
      await Session.findOneAndUpdate(
        { userId: user._id, isActive: true },
        { isActive: false },
        { sort: { lastUsedAt: 1 } }
      );
    }

    await Session.create({
      userId: user._id,
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() + SESSION_EXPIRES_IN),
      ip: context.ip,
      userAgent: context.userAgent,
      isActive: true
    });

    context.setAuthCookie && context.setAuthCookie(token);

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

  static async getUserSessions(userId: string) {
    const session = await Session.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true }
      },
      {
        $project: {
          _id: 1,
          ip: 1,
          userAgent: 1,
          lastUsedAt: 1,
          expiresAt: 1,
          isActive: 1,
          userId: 1
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      }
    ]);
    return session;
  }

  static async deleteUserSession(userId: string, sessionId: string) {
    return await Session.findOneAndDelete({
      userId,
      _id: sessionId
    });
  }

  static async logoutUser(userId: string, sessionId: string) {
    return await Session.deleteMany({ userId, _id: sessionId });
  }

  static async deleteAllUserSessions(userId: string) {
    return await Session.findOneAndDelete({
      userId
    });
  }
}
