import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/utils/api-response";
import { AsyncHandler } from "../../shared/utils/async-handler";

import { ApiError } from "../../shared/utils/api-error";
import { AuthService } from "./auth.service";
import { OtpService } from "../otp/otp.service";
import { clearCookie, setCookies } from "../../shared/helpers/cookie.helper";
import {
  deleteFileFromCloudinary,
  uploadToCloudinary
} from "../upload/upload.service";
import {
  RESET_PASSWORD_TOKEN_EXPIRY,
  SESSION_EXPIRES_IN
} from "./auth.constants";
import { DeleteAccountType, VerifyOtpType } from "./auth.validation";
import { UserRequest } from "@/types/global";

//? VERIFY OTP
export const verifyOtp = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otpCode, otpType }: VerifyOtpType = req.body;
    if (!email || !otpCode || !otpType) {
      return next(
        ApiError.badRequest("Email, OTP code and OTP type are required")
      );
    }

    const otp = await OtpService.verifyOtp(
      next,
      { email, otpCode, otpType },
      {
        setAuthCookie: (token: string) => {
          setCookies(res, [
            {
              cookie: "sid",
              value: token,
              maxAge: SESSION_EXPIRES_IN
            }
          ]);
        },
        ip: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || ""
      },
      {
        setCookie: (token: string) => {
          setCookies(res, [
            {
              cookie: "resetPasswordToken",
              value: token,
              maxAge: RESET_PASSWORD_TOKEN_EXPIRY
            }
          ]);
        }
      }
    );

    if (!otp) {
      return next(ApiError.server("Failed to verify OTP!"));
    }

    return ApiResponse.ok(res, otp?.message || "OTP verified successfully!");
  }
);

//? SIGNUP USER
export const signupUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return next(ApiError.badRequest("Name, email and password are required"));
    }

    const user = await AuthService.registerUser(next, {
      name,
      email,
      password,
      role
    });

    if (!user) {
      return next(ApiError.server("Failed to register user!"));
    }

    return ApiResponse.created(res, "User registered successfully", {
      name: user.name,
      email: user.email,
      role: user.role
    });
  }
);

//? SIGNIN USER
export const signinUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Email and password are required"));
    }

    const result = await AuthService.loginAndSendOtp(next, { email, password });

    if (!result) {
      return next(ApiError.server("Failed to login!"));
    }

    return ApiResponse.ok(res, result.message || "Otp sent successfully!");
  }
);

//? GET USER PROFILE
export const getUserProfile = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const user = await AuthService.getUserProfile(userId.toString());
    if (!user) {
      return next(ApiError.notFound("User not found"));
    }

    if (user.isDeleted) {
      return next(ApiError.notFound("This account has been deactivated."));
    }

    return ApiResponse.ok(res, "User profile fetched successfully", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt
      }
    });
  }
);

//? UPDATE PROFILE
export const updateProfile = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const data = req.body;
    const { name } = data;

    if (!req.user?._id) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const user = await AuthService.getUserProfile(req.user?._id.toString());

    if (!user) {
      return next(ApiError.notFound("User not found"));
    }

    if (req?.file && user?.avatar?.public_id) {
      await deleteFileFromCloudinary([user.avatar.public_id]);
    }

    if (req?.file && user?.avatar) {
      const file = await uploadToCloudinary(req.file.buffer, {
        folder: "uploads/files",
        resource_type: "auto"
      });
      user.avatar = {
        public_id: req.file
          ? file.public_id
          : (user?.avatar?.public_id as string),
        url: req.file ? file.url : (user.avatar.url as string),
        size: req.file ? file.size : (user.avatar.size as number)
      };
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    return ApiResponse.Success(res, "Profile updated successfully!", user);
  }
);

//? LOGOUT
export const logoutUser = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const currentSessionId = req.session?._id;
    if (!currentSessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await AuthService.logoutUser(userId.toString(), currentSessionId);

    clearCookie(res, "sid");

    return ApiResponse.Success(res, "Logged out successfully!");
  }
);

//? FORGOT PASSWORD
export const forgotPassword = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      return next(ApiError.badRequest("Email is required!"));
    }

    const result = await AuthService.forgotPassword(next, email);

    if (!result) {
      return next(ApiError.server("Failed to send otp!"));
    }

    return ApiResponse.ok(res, result.message || "Otp sent successfully!");
  }
);

//? RESET PASSWORD
export const resetPassword = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { newPassword, email } = req.body;
    if (!email || !newPassword) {
      return next(ApiError.badRequest("Newpassword and email are required!"));
    }

    const hashedResetPasswordToken = req.cookies?.hashedResetPasswordToken;

    if (!hashedResetPasswordToken) {
      return next(
        ApiError.badRequest("Reset password token not found or expired")
      );
    }

    const result = await AuthService.resetPassword(next, email, newPassword);

    if (!result) {
      return next(ApiError.server("Failed to reset password!"));
    }

    res.clearCookie("hashedResetPasswordToken");
    return ApiResponse.ok(
      res,
      result.message || "Password reset successfully!"
    );
  }
);

//? CHANGE PASSWORD
export const changePassword = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;

    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(
        ApiError.badRequest("Old password and new password are required")
      );
    }

    const result = await AuthService.changePassword(next, {
      userId: userId.toString(),
      oldPassword,
      newPassword
    });

    if (!result) {
      return next(ApiError.server("Failed to change password!"));
    }

    clearCookie(res, "sid");

    return ApiResponse.ok(
      res,
      result.message || "Password changed successfully!"
    );
  }
);

//? DELETE/DEACTIVATE ACCOUNT
export const deleteAccount = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { userId, type }: DeleteAccountType = req.body;

    if (!userId || !type) {
      return next(ApiError.badRequest("User id and type are required!"));
    }

    const reqUserId = req?.user?._id;

    if (!reqUserId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    if (userId !== reqUserId) {
      return next(
        ApiError.unauthorized("you are not authorized to perform this action")
      );
    }

    await AuthService.deleteOrDeactiveAccount(next, userId, type);

    if (type === "hard") {
      clearCookie(res, "sid");
    }

    return ApiResponse.Success(
      res,
      `Account ${type === "soft" ? "deactivated" : "deleted"} successfully!`
    );
  }
);

//? REACTIVATE ACCOUNT
export const reactivateAccount = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;

    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await AuthService.reactivateAccount(next, userId);

    return ApiResponse.Success(res, "Account reactivated successfully!");
  }
);

//? GET USER SESSIONS
export const getUserSessions = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;
    const currentSessionId = req.session?._id;

    if (!userId || !currentSessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const result = await AuthService.getUserSessions(userId.toString());

    if (!result) {
      return next(ApiError.server("Failed to get user sessions!"));
    }

    return ApiResponse.ok(res, "User sessions fetched successfully", result);
  }
);

//? DELETE SESSION
export const deleteUserSession = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;
    const { sessionId } = req.params;

    if (!userId || !sessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const result = await AuthService.deleteUserSession(
      userId,
      sessionId as string
    );

    if (!result) {
      return next(ApiError.server("Failed to delete user session!"));
    }

    const reqSId = req.cookies?.sid;

    const isCurrentSession = sessionId === reqSId;
    if (isCurrentSession) {
      clearCookie(res, "sid");
    }

    return ApiResponse.Success(res, "User session deleted successfully!");
  }
);

//? DELETE ALL SESSIONS
export const deleteAllUserSessions = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;

    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const result = await AuthService.deleteAllUserSessions(userId);

    if (!result) {
      return next(ApiError.server("Failed to delete user sessions!"));
    }

    res.clearCookie("sid");

    return ApiResponse.Success(res, "User sessions deleted successfully!");
  }
);
