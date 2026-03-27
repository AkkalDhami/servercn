import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("registerUser writes the pending signup marker only after OTP delivery and signup payload storage", async () => {
  const source = await readFile(
    new URL("./auth.service.ts", import.meta.url),
    "utf8"
  );

  const sendOtpIndex = source.indexOf("await OtpService.sendOtp({");
  const redisPayloadIndex = source.indexOf("await redisClient.set(redisKey, userData, {");
  const pendingMarkerIndex = source.indexOf("await redisClient.set(indexKey, hashCode, {");

  assert.notEqual(sendOtpIndex, -1);
  assert.notEqual(redisPayloadIndex, -1);
  assert.notEqual(pendingMarkerIndex, -1);
  assert.ok(sendOtpIndex < redisPayloadIndex);
  assert.ok(redisPayloadIndex < pendingMarkerIndex);
});

test("refreshTokens validates the session refreshTokenHash and rotates via a watched redis transaction", async () => {
  const source = await readFile(
    new URL("./auth.service.ts", import.meta.url),
    "utf8"
  );

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
  const source = await readFile(
    new URL("./auth.service.ts", import.meta.url),
    "utf8"
  );

  assert.doesNotMatch(
    source,
    /return next\(ApiError\.(unauthorized|forbidden|badRequest)\(/
  );
});

test("requestDeleteAccount never logs the raw delete-account token", async () => {
  const source = await readFile(
    new URL("./auth.service.ts", import.meta.url),
    "utf8"
  );

  assert.match(source, /logger\.info\(\{ userId \}, "Delete account email queued"\)/);
  assert.doesNotMatch(source, /logger\.warn\(`Delete account token: \$\{token\}`\)/);
});
