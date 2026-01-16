import crypto from "node:crypto";

//? generate otp
export function generateOTP(length: number = 6, ttlMinutes: number = 5) {
  const code = crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, "0");
  const hashCode = crypto.createHash("sha256").update(String(code)).digest("hex");
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  return { code, hashCode, expiresAt };
}

//? verify otp
export function verifyOTP(code: string, hashCode: string): boolean {
  const validCode = crypto.createHash("sha256").update(String(code)).digest("hex");
  return validCode === hashCode;
}

//? hash otp
export function hashOTP(otp: string): string {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
}

//? generate secure token
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

//? generate hashed token
export function generateHashedToken(token: string): string {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

//? generate token and hashed token
export function generateTokenAndHashedToken(id: string) {
  const cryptoSecret = process.env.CRYPTO_SECRET! || "secret";
  const token = crypto.createHmac("sha256", cryptoSecret).update(String(id)).digest("hex");

  const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");
  return { token, hashedToken };
}

//? verify hashed token
export function verifyHashedToken(token: string, hashedToken: string): boolean {
  return crypto.createHash("sha256").update(String(token)).digest("hex") === hashedToken;
}

//? generate uuid
export function generateUUID(): string {
  return crypto.randomUUID();
}

//? generate alphanumeric token
export function generateAlphanumericToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomBytes = crypto.randomBytes(length);
  let token = "";

  for (let i = 0; i < length; i++) {
    token += chars[randomBytes[i] % chars.length];
  }

  return token;
}

//? generate url safe token
export function generateURLSafeToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

//? generate numeric code
export function generateNumericCode(length: number = 6): string {
  const digits = "0123456789";
  const randomBytes = crypto.randomBytes(length);
  let code = "";

  for (let i = 0; i < length; i++) {
    code += digits[randomBytes[i] % 10];
  }

  return code;
}
