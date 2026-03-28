import assert from "node:assert/strict";
import test from "node:test";

const applyTestEnv = () => {
  process.env.NODE_ENV = "test";
  process.env.PORT = "3000";
  process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/testdb";
  process.env.CORS_ORIGIN = "http://localhost:3000";
  process.env.CLIENT_URL = "https://example.com";
  process.env.LOG_LEVEL = "info";
  process.env.JWT_ACCESS_SECRET = "a".repeat(32);
  process.env.JWT_REFRESH_SECRET = "b".repeat(32);
  process.env.CRYPTO_SECRET = "c".repeat(32);
  process.env.RESEND_API_KEY = "test-key";
  process.env.EMAIL_FROM = "noreply@example.com";
  process.env.CLOUDINARY_CLOUD_NAME = "cloud";
  process.env.CLOUDINARY_API_KEY = "key";
  process.env.CLOUDINARY_API_SECRET = "secret";
  process.env.GOOGLE_CLIENT_ID = "google-client";
  process.env.GOOGLE_CLIENT_SECRET = "google-secret";
  process.env.GOOGLE_REDIRECT_URI = "https://example.com/google/callback";
  process.env.GITHUB_CLIENT_ID = "github-client";
  process.env.GITHUB_CLIENT_SECRET = "github-secret";
  process.env.GITHUB_REDIRECT_URI = "https://example.com/github/callback";
  process.env.FACEBOOK_APP_ID = "facebook-app";
  process.env.FACEBOOK_APP_SECRET = "facebook-secret";
  process.env.FACEBOOK_REDIRECT_URI = "https://example.com/facebook/callback";
  process.env.REDIS_URL = "redis://localhost:6379";
};

test("registerUser cleans up pending signup state when redis persistence fails", async t => {
  applyTestEnv();

  const [{ AuthService }, { OtpService }, { default: db }, { default: redisClient }] =
    await Promise.all([
      import("./auth.service.ts"),
      import("./otp.service.ts"),
      import("../configs/db.ts"),
      import("../configs/redis.ts")
    ]);

  const email = "test@example.com";
  const delCalls: string[] = [];
  const setKeys: string[] = [];

  t.mock.method(db.query.users, "findFirst", async () => null);
  t.mock.method(OtpService, "checkOtpRestrictions", async () => undefined);
  t.mock.method(OtpService, "trackOtpRequests", async () => undefined);
  t.mock.method(OtpService, "sendOtp", async () => undefined);
  t.mock.method(redisClient, "get", async () => null);
  t.mock.method(redisClient, "set", async (key: string) => {
    setKeys.push(key);

    if (key === `user:pending:${email}`) {
      throw new Error("redis set failed");
    }

    return "OK";
  });
  t.mock.method(redisClient, "del", async (key: string) => {
    delCalls.push(key);
    return 1;
  });

  await assert.rejects(
    () =>
      AuthService.registerUser({
        name: "Test User",
        email,
        password: "super-secret",
        role: "user"
      }),
    /Failed to register user/
  );

  const redisKey = setKeys.find(key => key.startsWith(`user:${email}:`));
  const indexKey = `user:pending:${email}`;

  assert.ok(redisKey);
  assert.ok(setKeys.includes(indexKey));
  assert.ok(delCalls.includes(indexKey));
  assert.ok(delCalls.includes(redisKey!));
  assert.ok(delCalls.includes(`otp:${email}`));
  assert.ok(delCalls.includes(`otp_cooldown:${email}`));
});

test("refreshTokens validates the session refreshTokenHash and rotates via a watched redis transaction", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./auth.service.ts", import.meta.url), "utf8");

  assert.match(source, /await redisClient\.watch\(refreshTokenKey, sessionKey\);/);
  assert.match(
    source,
    /storedSessionData\.refreshTokenHash !== refreshTokenHash/
  );
  assert.match(source, /const transaction = redisClient\.multi\(\);/);
  assert.match(source, /const transactionResult = await transaction\.exec\(\);/);
  assert.match(
    source,
    /if \(!transactionResult\) {\s*throw ApiError\.unauthorized\("Refresh token already rotated\."\);/
  );
});

test("resetPassword and changePassword throw ApiError instead of calling next(ApiError)", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./auth.service.ts", import.meta.url), "utf8");

  assert.doesNotMatch(
    source,
    /return next\(ApiError\.(unauthorized|forbidden|badRequest)\(/
  );
});

test("requestDeleteAccount never logs the raw delete-account token", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("./auth.service.ts", import.meta.url), "utf8");

  assert.match(source, /logger\.info\(\{ userId \}, "Delete account email queued"\)/);
  assert.doesNotMatch(source, /logger\.warn\(`Delete account token: \$\{token\}`\)/);
});
