import { Router } from "express";
import { validateRequest } from "../../shared/middlewares/validate-request";
import {
  ChangePasswordSchema,
  DeleteAccountSchema,
  RequestOtpSchema,
  ResetPasswordSchema,
  SigninSchema,
  SignupSchema,
  UpdateProfileSchema,
  VerifyOtpSchema
} from "./auth.validation";
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
  resetPassword,
  signinUser,
  signupUser,
  updateProfile,
  verifyOtp
} from "./auth.controller";
import { verifyAuthentication } from "../../shared/middlewares/verify-auth";
import { checkUserAccountRestriction } from "../../shared/middlewares/user-account-restriction";
import {
  changePasswordLimiter,
  deleteAccountLimiter,
  otpRequestLimiter,
  otpVerificationLimiter,
  resetPasswordLimiter,
  signinRateLimiter,
  signupRateLimiter
} from "../../shared/middlewares/rate-limiter";
import upload from "../../shared/middlewares/upload-file";
import { validateObjectId } from "../../shared/middlewares/validate-id";

const router = Router();

router.post(
  "/verify-otp",
  validateRequest(VerifyOtpSchema),
  otpVerificationLimiter,
  verifyOtp
);

router.post(
  "/signup",
  validateRequest(SignupSchema),
  signupRateLimiter,
  signupUser
);

router.post(
  "/signin",
  validateRequest(SigninSchema),
  signinRateLimiter,
  signinUser
);

router.get("/profile", verifyAuthentication, getUserProfile);

router.get("/sessions", verifyAuthentication, getUserSessions);

router.delete("/sessions", verifyAuthentication, deleteAllUserSessions);

router.delete(
  "/sessions/:sessionId",
  validateObjectId("sessionId"),
  verifyAuthentication,
  deleteUserSession
);

router.patch(
  "/profile",
  upload.single("avatar"),
  validateRequest(UpdateProfileSchema),
  verifyAuthentication,
  checkUserAccountRestriction,
  updateProfile
);

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

router.delete(
  "/delete-account",
  verifyAuthentication,
  validateRequest(DeleteAccountSchema),
  checkUserAccountRestriction,
  deleteAccountLimiter,
  deleteAccount
);

router.put("/reactivate-account", verifyAuthentication, reactivateAccount);

export default router;
