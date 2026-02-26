import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { OtpResult, TokenResult } from './otp.interface';

@Injectable()
export class OtpService {
  /** Generate a numeric OTP with SHA-256 hash */
  generateOTP(length: number = 6, ttlMinutes: number = 5): OtpResult {
    const code = crypto
      .randomInt(0, Math.pow(10, length))
      .toString()
      .padStart(length, '0');
    const hashCode = crypto
      .createHash('sha256')
      .update(String(code))
      .digest('hex');
    const expiresAt = new Date(
      Date.now() + ttlMinutes * 60 * 1000,
    ).toISOString();
    return { code, hashCode, expiresAt };
  }

  /** Verify an OTP against its hash (timing-safe) */
  verifyOTP(code: string, hashCode: string): boolean {
    const validCode = crypto
      .createHash('sha256')
      .update(String(code))
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(validCode, 'hex'),
      Buffer.from(hashCode, 'hex'),
    );
  }

  /** Hash an OTP using SHA-256 */
  hashOTP(otp: string): string {
    return crypto.createHash('sha256').update(String(otp)).digest('hex');
  }

  /** Generate a cryptographically secure random token */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /** Generate a SHA-256 hash of a token */
  generateHashedToken(token: string): string {
    return crypto.createHash('sha256').update(String(token)).digest('hex');
  }

  /** Generate an HMAC token and its hash, bound to a specific identifier */
  generateTokenAndHashedToken(id: string): TokenResult {
    const cryptoSecret = process.env.CRYPTO_SECRET;
    if (!cryptoSecret) {
      throw new Error(
        'CRYPTO_SECRET environment variable is required for token generation',
      );
    }
    const token = crypto
      .createHmac('sha256', cryptoSecret)
      .update(String(id))
      .digest('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(String(token))
      .digest('hex');
    return { token, hashedToken };
  }

  /** Verify a token against its hash (timing-safe) */
  verifyHashedToken(token: string, hashedToken: string): boolean {
    const computed = crypto
      .createHash('sha256')
      .update(String(token))
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(computed, 'hex'),
      Buffer.from(hashedToken, 'hex'),
    );
  }

  /** Generate a v4 UUID */
  generateUUID(): string {
    return crypto.randomUUID();
  }

  /** Generate an alphanumeric token */
  generateAlphanumericToken(length: number = 32): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = crypto.randomBytes(length);
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars[randomBytes[i] % chars.length];
    }
    return token;
  }

  /** Generate a URL-safe Base64 token */
  generateURLSafeToken(length: number = 32): string {
    return crypto
      .randomBytes(length)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /** Generate a numeric code */
  generateNumericCode(length: number = 6): string {
    const digits = '0123456789';
    const randomBytes = crypto.randomBytes(length);
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits[randomBytes[i] % 10];
    }
    return code;
  }
}
