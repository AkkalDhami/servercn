import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("mvc otp service does not log raw OTP values", async () => {
  const source = await readFile(
    new URL("./otp.service.ts", import.meta.url),
    "utf8"
  );

  assert.match(source, /logger\.info\(\{ email \}, "OTP generated successfully"\)/);
  assert.doesNotMatch(source, /OTP generated successfully: \$\{/);
  assert.doesNotMatch(source, /logger\.(info|warn|error|debug|trace)\([^)]*(newOtp\.code|code \? code)/);
});

test("mvc otp verification increments failures before lockout evaluation", async () => {
  const source = await readFile(
    new URL("./otp.service.ts", import.meta.url),
    "utf8"
  );

  assert.match(source, /const failedAttempts = await redis\.incr\(failedAttemptsKey\);/);
  assert.match(
    source,
    /if \(failedAttempts === 1\) {\s*await redis\.expire\(\s*failedAttemptsKey,\s*Math\.floor\(OTP_EXPIRES_IN \/ 1000\)\s*\);/
  );
  assert.match(source, /if \(failedAttempts >= OTP_MAX_ATTEMPTS\) {/);
  assert.match(
    source,
    /Incorrect OTP\. \$\{OTP_MAX_ATTEMPTS - failedAttempts\} attempts left\./
  );
});

test("mvc otp service persists otp state before email delivery and cleans up on send failure", async () => {
  const source = await readFile(
    new URL("./otp.service.ts", import.meta.url),
    "utf8"
  );

  assert.match(source, /await redis\.set\(otpKey, otpHash,/);
  assert.match(source, /await redis\.set\(otpCooldownKey, OTP_COOL_DOWN,/);
  assert.match(source, /await sendEmail\(\{/);
  assert.match(
    source,
    /await Promise\.allSettled\(\[redis\.del\(otpKey\), redis\.del\(otpCooldownKey\)\]\);/
  );
});
