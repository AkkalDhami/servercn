import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "@/shared/utils/api-response";
import { AsyncHandler } from "@/shared/utils/async-handler";

import { ApiError } from "@/shared/utils/api-error";
import { authService, AuthService } from "./auth.service";
import {
  clearAuthCookies,
  setAuthCookies
} from "@/shared/helpers/cookie.helper";
import { AvatarData } from "./auth.interfaces";
import {
  deleteFileFromCloudinary,
  uploadToCloudinary
} from "../upload/upload.service";
import { DeleteAccountType, VerifyOtpType } from "./auth.validation";
import db from "@/shared/configs/db";
import { users } from "@/db/schemas/user.schema";
import { eq } from "drizzle-orm";
import { UserRequest } from "@/types/global";

//? SIGNUP USER
export const signupUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return next(ApiError.badRequest("Name, email and password are required"));
    }

    await authService.registerUser({
      name,
      email,
      password,
      role
    });

    return ApiResponse.created(
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

    await authService.verifyUser({ email, otpCode });

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

    await authService.signinUser(
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
    const userId = req?.user?.id;
    const currentSessionId = req.user?.sessionId;

    if (!userId || !currentSessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const user = await authService.getUserProfile(userId.toString());
    if (!user) {
      return next(ApiError.notFound("User not found"));
    }

    if (user.isDeleted) {
      return next(ApiError.notFound("This account has been deactivated."));
    }

    const result = await authService.getUserSessions(
      userId.toString(),
      currentSessionId
    );

    if (!result) {
      return next(ApiError.server("Failed to get user sessions!"));
    }

    return ApiResponse.ok(res, "User profile fetched successfully", {
      user: {
        id: user.id,
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

    if (!req.user?.id) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const user = await authService.getUserProfile(req.user?.id.toString());

    if (!user) {
      return next(ApiError.notFound("User not found"));
    }

    const avatar = user.avatar as AvatarData | null;
    let updatedAvatar: AvatarData | null = avatar;

    if (req?.file) {
      const file = await uploadToCloudinary(req.file.buffer, {
        folder: "uploads/files",
        resource_type: "auto"
      });
      updatedAvatar = {
        public_id: file.public_id,
        url: file.url,
        size: file.size
      };
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (updatedAvatar !== avatar) updateData.avatar = updatedAvatar;

    if (Object.keys(updateData).length > 0) {
      await db.update(users).set(updateData).where(eq(users.id, user.id));
    }

    if (avatar?.public_id && avatar.public_id !== updatedAvatar?.public_id) {
      await deleteFileFromCloudinary([avatar.public_id]);
    }

    const updatedUser = await authService.getUserProfile(user.id.toString());

    return ApiResponse.Success(res, "Profile updated successfully!", {
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        role: updatedUser?.role,
        avatar: updatedUser?.avatar,
        isEmailVerified: updatedUser?.isEmailVerified,
        lastLoginAt: updatedUser?.lastLoginAt
      }
    });
  }
);

//? REFRESH TOKENS
export const refreshToken = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    const token = await authService.refreshTokens(accessToken, refreshToken);

    if (!token) {
      return next(ApiError.server("Failed to refresh tokens!"));
    }

    const newAccessToken = token.accessToken;
    const newRefreshToken = token.refreshToken;
    setAuthCookies(res, newAccessToken, newRefreshToken, token.sessionId);

    return ApiResponse.Success(res, "Tokens refreshed successfully!");
  }
);

//? LOGOUT
export const logoutUser = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const currentSessionId = req.user?.sessionId;
    if (!currentSessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await authService.logoutUser(userId.toString(), currentSessionId);

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

    await authService.forgotPassword(email);

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

    await authService.verifyResetPasswordOtp(otpCode, email);

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

    const result = await authService.resetPassword(email, newPassword);

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
    const userId = req?.user?.id;

    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(
        ApiError.badRequest("Old password and new password are required")
      );
    }

    const result = await authService.changePassword({
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
    const userId = req?.user?.id;
    const { password } = req.body;

    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    if (!password) {
      return next(ApiError.badRequest("Password is required!"));
    }

    await authService.requestDeleteAccount(userId, password);

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

    const reqUserId = req?.user?.id;

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

    if (userId !== reqUserId.toString()) {
      return next(
        ApiError.unauthorized("You are not authorized to perform this action")
      );
    }

    await authService.deleteOrDeactiveAccount({ userId, type, token });

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
    const userId = req?.user?.id;

    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await authService.reactivateAccount(userId);

    return ApiResponse.Success(res, "Account reactivated successfully!");
  }
);

//? GET USER SESSIONS
export const getUserSessions = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?.id;
    const currentSessionId = req.user?.sessionId;

    if (!userId || !currentSessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const result = await authService.getUserSessions(
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
    const userId = req?.user?.id;
    const { sessionId } = req.params;

    if (!userId || !sessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await authService.deleteSession(userId, sessionId as string);

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
    const userId = req?.user?.id;
    const currentSessionId = req.user?.sessionId;

    if (!userId || !currentSessionId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await authService.deleteAllUserSessions(userId);

    clearAuthCookies(res);

    return ApiResponse.Success(res, "User sessions deleted successfully!");
  }
);
