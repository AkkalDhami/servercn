import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";

import { ApiError } from "../utils/api-error";
import { AuthService } from "../services/auth.service";
import { OtpService } from "../services/otp.service";
import {
  clearAuthCookies,
  setAuthCookies,
  setCookies
} from "../helpers/cookie.helper";
import { UserRequest } from "../types/user";
import {
  deleteFileFromCloudinary,
  uploadToCloudinary
} from "../services/cloudinary.service";
import { RESET_PASSWORD_TOKEN_EXPIRY } from "../constants/auth";
import { DeleteAccountType, VerifyOtpType } from "../validators/auth";

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
        setAuthCookie: (accessToken: string, refreshToken: string) => {
          setAuthCookies(res, accessToken, refreshToken);
        }
      },
      {
        setCookie: (token: string) => {
          setCookies(res, [
            {
              cookie: "hashedResetPasswordToken",
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
    return ApiResponse.ok(res, otp.message || "OTP verified successfully!");
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

//? REFRESH TOKENS
export const refreshToken = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    const token = await AuthService.refreshTokens(
      next,
      accessToken,
      refreshToken
    );

    if (!token) {
      return next(ApiError.server("Failed to refresh tokens!"));
    }

    const newAccessToken = token.accessToken;
    const newRefreshToken = token.refreshToken;
    setAuthCookies(res, newAccessToken, newRefreshToken);

    return ApiResponse.Success(res, "Tokens refreshed successfully!");
  }
);

//? LOGOUT
export const logoutUser = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await AuthService.logoutUser(userId.toString());

    clearAuthCookies(res);

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

    clearAuthCookies(res);

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

    clearAuthCookies(res);

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
