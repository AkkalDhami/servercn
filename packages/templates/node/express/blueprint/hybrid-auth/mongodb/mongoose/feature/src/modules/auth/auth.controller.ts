import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/utils/api-response";
import { AsyncHandler } from "../../shared/utils/async-handler";

import { ApiError } from "../../shared/utils/api-error";
import { AuthService } from "./auth.service";
import {
  clearAuthCookies,
  clearCookie,
  setAuthCookies
} from "../../shared/helpers/cookie.helper";
import { UserRequest } from "../../types/global";
import {
  deleteFileFromCloudinary,
  uploadToCloudinary
} from "../upload/upload.service";
import { DeleteAccountType, VerifyOtpType } from "./auth.validator";

//? SIGNUP USER
export const signupUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return next(ApiError.badRequest("Name, email and password are required"));
    }

    await AuthService.registerUser({
      name,
      email,
      password,
      role
    });

    return ApiResponse.Success(
      res,
      "User registered successfully. Please check your email for verification."
    );
  }
);

//? VERIFY USER
export const verifyUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otpCode }: VerifyOtpType = req.body;

    if (!email || !otpCode) {
      return next(ApiError.badRequest("Email and code are required"));
    }

    await AuthService.verifyUser({ email, otpCode });

    return ApiResponse.ok(res, "User verified successfully");
  }
);

//? SIGNIN USER
export const signinUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Email and password are required"));
    }

    const ip = req.ip || "Unknown";
    const userAgent = req.headers["user-agent"] || "Unknown";

    await AuthService.signinUser(
      { email, password, ip, userAgent },
      {
        setAuthCookie: (
          accessToken: string,
          refreshToken: string,
          sessionId: string
        ) => {
          setAuthCookies(res, accessToken, refreshToken, sessionId);
        }
      }
    );

    return ApiResponse.ok(res, "User signed in successfully!");
  }
);

//? GET USER PROFILE
export const getUserProfile = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;
    const currentSessionId = req.user?.sessionId;

    if (!userId || !currentSessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const user = await AuthService.getUserProfile(userId.toString());
    if (!user) {
      return next(ApiError.notFound("User not found"));
    }

    if (user.isDeleted) {
      return next(ApiError.notFound("This account has been deactivated."));
    }

    const result = await AuthService.getUserSessions(
      userId.toString(),
      currentSessionId
    );

    if (!result) {
      return next(ApiError.server("Failed to get user sessions!"));
    }

    return ApiResponse.ok(res, "User profile fetched successfully", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
        sessions: result
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

    return ApiResponse.Success(res, "Profile updated successfully!", {
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

//? REFRESH TOKENS
export const refreshToken = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    const token = await AuthService.refreshTokens(accessToken, refreshToken);

    if (!token) {
      return next(ApiError.server("Failed to refresh tokens!"));
    }

    const newAccessToken = token.accessToken;
    const newRefreshToken = token.refreshToken;
    setAuthCookies(res, newAccessToken, newRefreshToken, token.sessionId);
    clearCookie(res, "refreshToken");

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

    const currentSessionId = req.user?.sessionId;
    if (!currentSessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await AuthService.logoutUser(userId.toString(), currentSessionId);

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

    await AuthService.forgotPassword(email);

    return ApiResponse.ok(
      res,
      "If an account exists, a reset code has been sent to your email."
    );
  }
);

//? VERIFY RESET PASSWORD TOKEN
export const verifyResetPasswordOtp = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otpCode, email } = req.body;
    if (!otpCode || !email) {
      return next(ApiError.badRequest("OtpCode and email are required!"));
    }

    await AuthService.verifyResetPasswordOtp(otpCode, email);

    return ApiResponse.ok(
      res,
      "Password reset otp verified successfully. You can now reset your password."
    );
  }
);

//? RESET PASSWORD
export const resetPassword = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { newPassword, email } = req.body;
    if (!email || !newPassword) {
      return next(ApiError.badRequest("Newpassword and email are required!"));
    }

    const result = await AuthService.resetPassword(next, email, newPassword);

    if (!result) {
      return next(ApiError.server("Failed to reset password!"));
    }

    clearAuthCookies(res);

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

//? REQUEST DELETE ACCOUNT
export const requestDeleteAccount = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;
    const { password } = req.body;

    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    if (!password) {
      return next(ApiError.badRequest("Password is required!"));
    }

    await AuthService.requestDeleteAccount(userId, password);

    return ApiResponse.ok(
      res,
      "Account deletion request sent successfully. Please check your email to confirm."
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
    const token = req.query.token as string;
    if (!token) {
      return next(
        ApiError.badRequest(
          `${type === "hard" ? "Delete" : "Deactivate"} account token is required!`
        )
      );
    }

    if (userId !== reqUserId) {
      return next(
        ApiError.unauthorized("You are not authorized to perform this action")
      );
    }

    await AuthService.deleteOrDeactiveAccount({ userId, type, token });

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

    await AuthService.reactivateAccount(userId);

    return ApiResponse.Success(res, "Account reactivated successfully!");
  }
);

//? GET USER SESSIONS
export const getUserSessions = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;
    const currentSessionId = req.user?.sessionId;

    if (!userId || !currentSessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const result = await AuthService.getUserSessions(
      userId.toString(),
      currentSessionId
    );

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

    await AuthService.deleteUserSession(userId, sessionId as string);

    const reqSId = req.cookies?.sid;

    const isCurrentSession = sessionId === reqSId;
    if (isCurrentSession) {
      clearAuthCookies(res);
    }

    return ApiResponse.Success(res, "User session deleted successfully!");
  }
);

//? DELETE ALL SESSIONS
export const deleteAllUserSessions = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;
    const currentSessionId = req.user?.sessionId;

    if (!userId || !currentSessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await AuthService.deleteAllUserSessions(userId);

    clearAuthCookies(res);
    // clearCookie(res, "sid");

    return ApiResponse.Success(res, "User sessions deleted successfully!");
  }
);
