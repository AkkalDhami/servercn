import { logger } from "../../shared/utils/logger";
import redis from "../../shared/configs/redis";
import {
  OTP_CODE_LENGTH,
  OTP_EXPIRES_IN,
  OTP_MAX_ATTEMPTS,
  OTP_SPAM_LOCK_TIME,
  OTP_COOL_DOWN
} from "../auth/auth.constants";
import { generateOTP } from "../../shared/helpers/token.helpers";
import { ApiError } from "../../shared/utils/api-error";
import { sendEmail } from "../../shared/utils/send-mail";

type SendOtpBase = {
  name: string;
  email: string;
  templateName: string;
  subject: string;
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
    try {
      const otpRequestKey = `otp_request_count:${email}`;
      let otpRequestsCount = parseInt((await redis.get(otpRequestKey)) || "0");
      if (otpRequestsCount >= OTP_MAX_ATTEMPTS) {
        await redis.set(`otp_spam_lock:${email}`, "locked", {
          expiration: {
            type: "EX",
            value: 3600
          }
        });
        throw ApiError.tooManyRequests(
          "Too many otp requests. Please try again after 1 hour before requesting again."
        );
      }

      await redis.set(otpRequestKey, otpRequestsCount + 1, {
        expiration: {
          type: "EX",
          value: 3600
        }
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.server("Failed to track otp requests!");
    }
  }

  static async sendOtp({
    name,
    email,
    templateName,
    code,
    hashCode,
    subject
  }: SendOtpType) {
    try {
      const newOtp = generateOTP(OTP_CODE_LENGTH);

      logger.info(`OTP generated successfully: ${code ? code : newOtp.code}`);

      await sendEmail({
        email,
        subject,
        data: {
          code: code ? code : newOtp.code,
          name
        },
        templateName
      });

      await redis.set(`otp:${email}`, hashCode ? hashCode : newOtp.hashCode, {
        expiration: {
          type: "EX",
          value: OTP_EXPIRES_IN / 1000
        }
      });

      await redis.set(`otp_cooldown:${email}`, OTP_COOL_DOWN, {
        expiration: {
          type: "EX",
          value: OTP_COOL_DOWN
        }
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.server("Failed to send otp!");
    }
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
      if (failedAttempts >= OTP_MAX_ATTEMPTS) {
        await redis.set(`otp_lock:${email}`, "locked", {
          EX: OTP_SPAM_LOCK_TIME / 1000
        });
        throw ApiError.tooManyRequests(
          "Too many failed attempts. Please try again after 1 hour."
        );
      }
      await redis.set(failedAttemptsKey, failedAttempts + 1, {
        EX: OTP_EXPIRES_IN / 1000
      });
      throw ApiError.badRequest(
        `Incorrect OTP. ${OTP_MAX_ATTEMPTS - failedAttempts} attempts left.`
      );
    }

    await redis.del([`otp:${email}`, failedAttemptsKey]);
  }
}
