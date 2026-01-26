import { Router } from "express";
import {
  changePassword,
  deleteAccount,
  forgotPassword,
  getUserProfile,
  loginUser,
  logoutUser,
  reactivateAccount,
  refreshToken,
  resetPassword,
  signupUser,
  updateProfile,
  verifyForgotPasswordOtp,
  verifyUser
} from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validate-request";
import {
  ChangePasswordSchema,
  DeleteAccountSchema,
  ResetPasswordSchema,
  SigninSchema,
  SignupSchema,
  UpdateProfileSchema,
  VerifyOtpSchema
} from "../validators/auth";
import { verifyAuthentication } from "../middlewares/verify-auth";
import upload from "../middlewares/upload-file";
import {
  changePasswordLimiter,
  deleteAccountLimiter,
  resetPasswordLimiter,
  signinRateLimiter,
  signupRateLimiter
} from "../middlewares/rate-limiter";
import { checkUserAccountRestriction } from "../middlewares/user-account-restriction";

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
  loginUser
);

router.get("/profile", verifyAuthentication, getUserProfile);

router.patch(
  "/profile",
  verifyAuthentication,
  upload.single("avatar"),
  validateRequest(UpdateProfileSchema),
  checkUserAccountRestriction,
  updateProfile
);

router.post("/refresh-token", refreshToken);

router.post(
  "/forgot-password",
  validateRequest(VerifyOtpSchema.pick({ email: true })),
  forgotPassword
);

router.post(
  "/verify-forgot-password",
  validateRequest(VerifyOtpSchema),
  verifyForgotPasswordOtp
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
  changePasswordLimiter,
  checkUserAccountRestriction,
  changePassword
);

router.post("/logout", verifyAuthentication, logoutUser);

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
