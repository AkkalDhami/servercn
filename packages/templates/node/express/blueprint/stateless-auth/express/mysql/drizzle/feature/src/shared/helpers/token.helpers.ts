import crypto from "node:crypto";

export function generateOTP(length: number = 6, ttlMinutes: number = 5) {
  const code = crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, "0");

  const hashCode = crypto
    .createHash("sha256")
    .update(String(code))
    .digest("hex");

  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();

  return { code, hashCode, expiresAt };
}

export function generateHashedToken(token: string): string {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function verifyHashedToken(token: string, hashedToken: string): boolean {
  return (
    crypto.createHash("sha256").update(String(token)).digest("hex") ===
    hashedToken
  );
}

export function generateTokenAndHashedToken(id: string) {
  const cryptoSecret = process.env.CRYPTO_SECRET! || "secret";
  const token = crypto
    .createHmac("sha256", cryptoSecret)
    .update(String(id))
    .digest("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(String(token))
    .digest("hex");
  return { token, hashedToken };
}

export function generateUUID(): string {
  return crypto.randomUUID();
}
