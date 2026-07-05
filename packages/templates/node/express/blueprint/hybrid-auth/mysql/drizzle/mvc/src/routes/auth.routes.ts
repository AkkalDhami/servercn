import { Router } from "express";
import { validateRequest } from "../middlewares/validate-request";
import {
  ChangePasswordSchema,
  DeleteAccountSchema,
  RequestOtpSchema,
  ResetPasswordSchema,
  SigninSchema,
  SignupSchema,
  UpdateProfileSchema,
  VerifyOtpSchema
} from "../validators/auth";
import {
  changePassword,
  deleteAccount,
  deleteAllUserSessions,
  deleteUserSession,
  forgotPassword,
  getUserProfile,
  getUserSessions,
  logoutUser,
  reactivateAccount,
  refreshToken,
  requestDeleteAccount,
  resetPassword,
  signinUser,
  signupUser,
  updateProfile,
  verifyResetPasswordOtp,
  verifyUser
} from "../controllers/auth.controller";
import { verifyAuthentication } from "../middlewares/verify-auth";
import { checkUserAccountRestriction } from "../middlewares/user-account-restriction";
import {
  changePasswordLimiter,
  deleteAccountLimiter,
  otpRequestLimiter,
  resetPasswordLimiter,
  signinRateLimiter,
  signupRateLimiter
} from "../middlewares/rate-limiter";
import upload from "../middlewares/upload-file";

const router = Router();

router.post(
  "/signup",
  validateRequest(SignupSchema),
  signupRateLimiter,
  signupUser
);

router.post("/verify-user", validateRequest(VerifyOtpSchema), verifyUser);

router.post(
  "/signin",
  validateRequest(SigninSchema),
  signinRateLimiter,
  signinUser
);

router.get("/profile", verifyAuthentication, getUserProfile);

router.patch(
  "/profile",
  upload.single("avatar"),
  validateRequest(UpdateProfileSchema),
  verifyAuthentication,
  checkUserAccountRestriction,
  updateProfile
);

router.get("/sessions", verifyAuthentication, getUserSessions);

router.delete(
  "/sessions",
  verifyAuthentication,
  checkUserAccountRestriction,
  deleteAllUserSessions
);

router.delete(
  "/sessions/:sessionId",
  verifyAuthentication,
  checkUserAccountRestriction,
  deleteUserSession
);

router.post("/refresh-token", refreshToken);

router.post(
  "/logout",
  verifyAuthentication,
  checkUserAccountRestriction,
  logoutUser
);

router.post(
  "/forgot-password",
  validateRequest(RequestOtpSchema.pick({ email: true })),
  otpRequestLimiter,
  forgotPassword
);

router.post(
  "/verify-reset-otp",
  validateRequest(VerifyOtpSchema),
  otpRequestLimiter,
  verifyResetPasswordOtp
);

router.post(
  "/reset-password",
  validateRequest(ResetPasswordSchema),
  resetPasswordLimiter,
  resetPassword
);

router.post(
  "/change-password",
  verifyAuthentication,
  validateRequest(ChangePasswordSchema),
  checkUserAccountRestriction,
  changePasswordLimiter,
  changePassword
);

router.post(
  "/account/request-delete",
  verifyAuthentication,
  validateRequest(SigninSchema.pick({ password: true })),
  checkUserAccountRestriction,
  deleteAccountLimiter,
  requestDeleteAccount
);

router.delete(
  "/account/delete",
  verifyAuthentication,
  validateRequest(DeleteAccountSchema),
  checkUserAccountRestriction,
  deleteAccountLimiter,
  deleteAccount
);

router.put("/account/reactivate", verifyAuthentication, reactivateAccount);

export default router;
