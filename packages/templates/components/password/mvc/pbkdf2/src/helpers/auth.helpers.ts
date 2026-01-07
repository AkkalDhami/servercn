import crypto from "crypto";

const DEFAULTS = {
  iterations: 310000,
  keyLength: 64,
  saltLength: 16,
  digest: "sha512",
};

export function hashPasswordPbkdf2(
  password: string,
  options = DEFAULTS
): string {
  const salt = crypto.randomBytes(options.saltLength);

  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    options.iterations,
    options.keyLength,
    options.digest
  );

  return [
    "pbkdf2",
    options.iterations,
    options.digest,
    salt.toString("hex"),
    derivedKey.toString("hex"),
  ].join("$");
}

export function verifyPasswordPbkdf2(
  password: string,
  storedHash: string
): boolean {
  const [algo, iterations, digest, saltHex, hashHex] = storedHash.split("$");

  if (algo !== "pbkdf2") {
    throw new Error("Invalid PBKDF2 hash format");
  }

  const salt = Buffer.from(saltHex, "hex");
  const hash = Buffer.from(hashHex, "hex");

  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    Number(iterations),
    hash.length,
    digest
  );

  return crypto.timingSafeEqual(hash, derivedKey);
}
