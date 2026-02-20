import redis from "../configs/redis";
import {
  OTP_CODE_LENGTH,
  OTP_COOL_DOWN,
  OTP_EXPIRES_IN,
  OTP_MAX_COUNTS,
  OTP_SPAM_LOCK
} from "../constants/auth";
import { generateOTP } from "../helpers/token.helpers";
import { ApiError } from "../utils/api-error";
import { sendEmail } from "../utils/send-mail";

type SendOtpBase = {
  name: string;
  email: string;
  templateName: string;
};

type SendOtpWithCode = SendOtpBase & {
  code: string;
  hashCode: string;
};

type SendOtpWithoutCode = SendOtpBase & {
  code?: never;
  hashCode?: never;
};

export type SendOtpType = SendOtpWithCode | SendOtpWithoutCode;

export class OtpService {
  static async checkOtpRestrictions(email: string) {
    const otpLock = await redis.get(`otp_lock:${email}`);
    if (otpLock) {
      throw ApiError.badRequest(
        "Your Account is locked due to multiple failed attempts. Please try again after 30 minutes."
      );
    }

    if (await redis.get(`otp_spam_lock:${email}`)) {
      throw ApiError.tooManyRequests(
        "Too many otp requests. Please try again after 1 hour before requesting again."
      );
    }

    if (await redis.get(`otp_cooldown:${email}`)) {
      throw ApiError.tooManyRequests(
        "Too many otp requests. Please try again after 1 minute before requesting new otp."
      );
    }
  }

  static async trackOtpRequests(email: string) {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequestsCount = parseInt((await redis.get(otpRequestKey)) || "0");
    if (otpRequestsCount >= OTP_MAX_COUNTS) {
      await redis.set(`otp_spam_lock:${email}`, "locked", {
        EX: OTP_SPAM_LOCK / 1000
      });
      throw ApiError.tooManyRequests(
        "Too many otp requests. Please try again after 1 hour before requesting again."
      );
    }

    await redis.set(otpRequestKey, otpRequestsCount + 1, {
      EX: OTP_SPAM_LOCK / 1000
    });
  }

  static async sendOtp({
    name,
    email,
    templateName,
    code,
    hashCode
  }: SendOtpType) {
    const newOtp = generateOTP(OTP_CODE_LENGTH);

    await sendEmail({
      email,
      subject:
        templateName === "email-verification"
          ? "Verify your email"
          : "Verify your OTP",
      data: {
        code: code ? code : newOtp.code,
        name
      },
      templateName
    });

    await redis.set(`otp:${email}`, hashCode ? hashCode : newOtp.hashCode, {
      EX: OTP_EXPIRES_IN / 1000
    });

    await redis.set(`otp_cooldown:${email}`, OTP_COOL_DOWN, {
      EX: OTP_COOL_DOWN
    });
  }

  static async verifyOtp(hashCode: string, email: string) {
    const hashOtpCodeKey = await redis.get(`otp:${email}`);

    if (!hashOtpCodeKey) {
      throw ApiError.badRequest("Invalid or expired otp");
    }

    const failedAttemptsKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt(
      (await redis.get(failedAttemptsKey)) || "0"
    );

    if (hashOtpCodeKey !== hashCode) {
      if (failedAttempts >= OTP_MAX_COUNTS) {
        await redis.set(`otp_lock:${email}`, "locked", {
          EX: OTP_SPAM_LOCK / 1000
        });
        throw ApiError.tooManyRequests(
          "Too many failed attempts. Please try again after 1 hour."
        );
      }
      await redis.set(failedAttemptsKey, failedAttempts + 1, {
        EX: OTP_EXPIRES_IN / 1000
      });
      throw ApiError.badRequest(
        `Incorrect OTP. ${OTP_MAX_COUNTS - failedAttempts} attempts left.`
      );
    }

    await redis.del([`otp:${email}`, failedAttemptsKey]);
  }
}
