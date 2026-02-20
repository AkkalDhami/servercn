import crypto from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(
  crypto.scrypt as (
    password: crypto.BinaryLike,
    salt: crypto.BinaryLike,
    keylen: number,
    options: crypto.ScryptOptions,
    callback: (err: Error | null, derivedKey: Buffer) => void
  ) => void
);

const DEFAULTS = {
  keyLength: 64,
  saltLength: 16,
  N: 16384,
  r: 8,
  p: 1
};

export async function hashPasswordScrypt(
  password: string,
  options = DEFAULTS
): Promise<string> {
  const salt = crypto.randomBytes(options.saltLength);

  const derivedKey = await scryptAsync(password, salt, options.keyLength, {
    N: options.N,
    r: options.r,
    p: options.p
  });

  return [
    "scrypt",
    options.N,
    options.r,
    options.p,
    salt.toString("hex"),
    derivedKey.toString("hex")
  ].join("$");
}

export async function verifyPasswordScrypt(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [algo, N, r, p, saltHex, hashHex] = storedHash.split("$");

  if (algo !== "scrypt") {
    throw new Error("Invalid scrypt hash format");
  }

  const salt = Buffer.from(saltHex, "hex");
  const hash = Buffer.from(hashHex, "hex");

  const derivedKey = await scryptAsync(password, salt, hash.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p)
  });

  return crypto.timingSafeEqual(hash, derivedKey);
}
