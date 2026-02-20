import { NextFunction } from "express";
import { OTPType } from "./otp.types";
import User from "../auth/user.model";
import { ApiError } from "../../shared/errors/api-error";
import Otp from "./otp.model";
import {
  NEXT_OTP_DELAY,
  OTP_CODE_LENGTH,
  OTP_EXPIRES_IN,
  OTP_MAX_ATTEMPTS
} from "./otp.constants";
import {
  generateHashedToken,
  generateOTP
} from "../../shared/helpers/token.helpers";
import { logger } from "../../shared/utils/logger";
import { sendEmail } from "../../shared/utils/send-mail";
import { AuthService } from "../auth/auth.service";
import { RESET_PASSWORD_TOKEN_EXPIRY } from "../auth/auth.constants";
import { IUser } from "../auth/auth.types";

type VerifyOtpPayload = {
  email: string;
  otpCode: string;
  otpType: OTPType;
};

type VerifyOtpContext = {
  setAuthCookie?: (accessToken: string, refreshToken: string) => void;
};

type ResetPassowrdContext = {
  setCookie?: (token: string) => void;
};

type SendOtpPayload = {
  email: string;
  otpType: OTPType;
  subject: string;
};

export class OtpService {
  static async sendOtp(next: NextFunction, payload: SendOtpPayload) {
    const { email, otpType, subject } = payload;

    const user = await User.findOne({ email });
    if (!user) {
      return next(ApiError.badRequest("Invalid request"));
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      return next(ApiError.badRequest("Account locked"));
    }

    const existingOtp = await Otp.findOne({ email, type: otpType });

    if (existingOtp && existingOtp.nextResendAllowedAt > new Date()) {
      const remainingSec = Math.ceil(
        (existingOtp.nextResendAllowedAt.getTime() - Date.now()) / 1000
      );
      return next(
        ApiError.badRequest(
          `Please wait ${remainingSec} seconds before requesting another OTP`
        )
      );
    }

    const otp = generateOTP(OTP_CODE_LENGTH, OTP_EXPIRES_IN);
    logger.info(
      `Sending OTP to ${email} with type ${otpType} and code ${otp.code}`
    );
    const nextResendAllowedAt = new Date(Date.now() + NEXT_OTP_DELAY);

    const html = `<p>Your OTP for ${otpType}: ${otp.code}</p>`;
    await sendEmail({
      email,
      subject: subject,
      html
    });

    await Otp.create({
      email: payload.email,
      type: payload.otpType,
      otpHashCode: otp.hashCode,
      attempts: 0,
      isUsed: false,
      expiresAt: otp.expiresAt,
      nextResendAllowedAt
    });

    return { message: `OTP sent to ${email} successfully` };
  }

  static async verifyOtp(
    next: NextFunction,
    payload: VerifyOtpPayload,
    context: VerifyOtpContext,
    resetPasswordContext: ResetPassowrdContext
  ): Promise<any> {
    const { email, otpCode, otpType } = payload;

    const user = await User.findOne({ email });
    if (!user) {
      return next(ApiError.unauthorized("Unauthorized, Please login first."));
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutes = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 60000
      );
      return next(
        ApiError.badRequest(
          `Your account has been locked. Try again in ${minutes} minutes.`
        )
      );
    }

    const otp = await Otp.findOne({
      email,
      type: otpType,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    })
      .sort({ createdAt: -1 })
      .select("+otpHashCode");

    if (!otp) {
      return next(ApiError.badRequest("Invalid or expired OTP"));
    }

    if (otp.attempts >= (otp.maxAttempts || OTP_MAX_ATTEMPTS)) {
      return next(ApiError.badRequest("Maximum OTP attempts reached"));
    }

    const hashedOtp = generateHashedToken(String(otpCode));

    if (otp.otpHashCode !== hashedOtp) {
      await Otp.updateOne({ _id: otp._id }, { $inc: { attempts: 1 } });
      return next(ApiError.badRequest("Invalid OTP code"));
    }

    otp.isUsed = true;
    await otp.save();

    if (otp.type === "signin") {
      return await AuthService.handleToken(
        {
          _id: user._id.toString(),
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        context
      );
    }

    if (otp.type === "password-reset") {
      return this.handlePasswordReset(
        {
          _id: user._id.toString()
        },
        resetPasswordContext
      );
    }

    await Otp.deleteOne({ _id: otp._id });
    await Otp.deleteMany({
      expiresAt: { $lt: new Date() },
      isUsed: true
    });
    return { message: "OTP verified successfully" };
  }

  private static handlePasswordReset(
    user: Pick<IUser, "_id">,
    context: ResetPassowrdContext
  ) {
    const hashedResetPasswordToken = generateHashedToken(user._id.toString());
    const resetPasswordExpiry = new Date(
      Date.now() + RESET_PASSWORD_TOKEN_EXPIRY
    );

    context.setCookie && context.setCookie(hashedResetPasswordToken);

    return {
      hashedResetPasswordToken,
      resetPasswordExpiry
    };
  }
}
