import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/async-handler";
import {
  ChangePasswordType,
  DeleteAccountType,
  ResetPasswordType,
  SigninUserType,
  SignupUserType,
  VerifyOtpType
} from "../validators/auth";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { AuthService } from "../services/auth.service";
import { clearAuthCookies, setAuthCookies } from "../helpers/cookie.helper";
import { UserRequest } from "../types/user";

//? SIGNUP USER
export const signupUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role, name }: SignupUserType = req.body;

    if (!name || !email || !password) {
      return next(ApiError.badRequest("Name, email and password are required"));
    }

    await AuthService.signupUser({
      email,
      password,
      role,
      name
    });

    return ApiResponse.created(
      res,
      "User registered successfully. Please check your email for verification"
    );
  }
);

//? VERIFY USER
export const verifyUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, code }: VerifyOtpType = req.body;

    if (!email || !code) {
      return next(ApiError.badRequest("Email and code are required"));
    }

    await AuthService.verifyUser({ email, code });

    return ApiResponse.ok(res, "User verified successfully");
  }
);

//? LOGIN USER
export const loginUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: SigninUserType = req.body;

    if (!email || !password) {
      return next(ApiError.badRequest("Email and password are required"));
    }

    const result = await AuthService.loginUser(
      {
        email,
        password
      },
      {
        setAuthCookie(accessToken, refreshToken) {
          setAuthCookies(res, accessToken, refreshToken);
        }
      }
    );

    if (!result) {
      return next(ApiError.server("User login failed"));
    }

    return ApiResponse.ok(res, "User logged in successfully", result);
  }
);

//? GET USER PROFILE
export const getUserProfile = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const user = await AuthService.getUserProfile(userId);
    if (!user) {
      return next(ApiError.notFound("User not found"));
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
    const { name } = req.body;

    if (!req.user?.id) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const user = await AuthService.getUserProfile(req.user.id);

    if (!user) {
      return next(ApiError.notFound("User not found"));
    }

    const updatedUser = await AuthService.updateUserProfile(req.user.id, {
      name,
      avatar: req.file
    });

    if (!updatedUser) {
      return next(ApiError.server("Failed to update profile"));
    }

    return ApiResponse.Success(
      res,
      "Profile updated successfully!",
      updatedUser
    );
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
    setAuthCookies(res, newAccessToken, newRefreshToken);

    return ApiResponse.Success(res, "Tokens refreshed successfully!");
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

    return ApiResponse.ok(res, `Otp sent to ${email} successfully!`);
  }
);

//? VERIFY FORGOT PASSWORD OTP
export const verifyForgotPasswordOtp = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, code }: VerifyOtpType = req.body;
    if (!email || !code) {
      return next(ApiError.badRequest("Email and code are required!"));
    }

    await AuthService.verifyForgotPasswordOtp({ email, code });

    return ApiResponse.ok(res, `Otp verified successfully!`);
  }
);

//? RESET PASSWORD
export const resetPassword = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, newPassword }: ResetPasswordType = req.body;
    if (!email || !newPassword) {
      return next(ApiError.badRequest("Email and password are required!"));
    }

    await AuthService.resetPassword({ email, newPassword });

    return ApiResponse.ok(res, `Password reset successfully!`);
  }
);

//? CHANGE PASSWORD
export const changePassword = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword }: ChangePasswordType = req.body;
    if (!oldPassword || !newPassword) {
      return next(
        ApiError.badRequest("Old password and new password are required!")
      );
    }

    const userId = req.user?.id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await AuthService.changePassword(userId, {
      oldPassword,
      newPassword
    });

    return ApiResponse.ok(res, `Password changed successfully!`);
  }
);

//? LOGOUT
export const logoutUser = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await AuthService.logoutUser(userId);
    clearAuthCookies(res);

    return ApiResponse.ok(res, "User logged out successfully!");
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

    if (userId !== reqUserId) {
      return next(
        ApiError.unauthorized("you are not authorized to perform this action")
      );
    }

    await AuthService.deleteAccount({ userId, type });
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
    const reqUserId = req?.user?.id;

    if (!reqUserId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    await AuthService.reactivateAccount(reqUserId);

    return ApiResponse.Success(res, `Account reactivated successfully!`);
  }
);
