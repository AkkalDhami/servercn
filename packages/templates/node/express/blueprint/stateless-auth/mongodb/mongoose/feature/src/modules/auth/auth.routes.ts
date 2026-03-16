import { Router } from "express";
import {
  ChangePasswordSchema,
  DeleteAccountSchema,
  ResetPasswordSchema,
  SigninSchema,
  SignupSchema,
  UpdateProfileSchema
} from "./auth.validator";
import {
  changePassword,
  deleteAccount,
  forgotPassword,
  getUserProfile,
  logoutUser,
  reactivateAccount,
  refreshToken,
  resetPassword,
  signinUser,
  signupUser,
  updateProfile,
  verifyOtp
} from "./auth.controller";
import {
  changePasswordLimiter,
  deleteAccountLimiter,
  otpRequestLimiter,
  otpVerificationLimiter,
  resetPasswordLimiter,
  signinRateLimiter,
  signupRateLimiter
} from "../../shared/middlewares/rate-limiter";
import { validateRequest } from "../../shared/middlewares/validate-request";
import { verifyAuthentication } from "../../shared/middlewares/verify-auth";
import upload from "../../shared/middlewares/upload-file";
import { checkUserAccountRestriction } from "../../shared/middlewares/user-account-restriction";
import { RequestOtpSchema, VerifyOtpSchema } from "../otp/otp.validator";

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

router.patch(
  "/profile",
  upload.single("avatar"),
  validateRequest(UpdateProfileSchema),
  verifyAuthentication,
  checkUserAccountRestriction,
  updateProfile
);

router.post("/refresh-token", checkUserAccountRestriction, refreshToken);

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
