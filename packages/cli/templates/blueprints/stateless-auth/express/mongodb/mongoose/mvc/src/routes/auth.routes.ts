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
} from "../controllers/auth.controller";
import { verifyAuthentication } from "../middlewares/verify-auth";
import { checkUserAccountRestriction } from "../middlewares/user-account-restriction";
import {
  changePasswordLimiter,
  deleteAccountLimiter,
  otpRequestLimiter,
  otpVerificationLimiter,
  resetPasswordLimiter,
  signinRateLimiter,
  signupRateLimiter
} from "../middlewares/rate-limiter";
import upload from "../middlewares/upload-file";

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
