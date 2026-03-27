import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("otp service does not log raw OTP values", async () => {
  const source = await readFile(
    new URL("./otp.service.ts", import.meta.url),
    "utf8"
  );

  assert.match(source, /logger\.info\(\{ email \}, "OTP generated successfully"\)/);
  assert.doesNotMatch(source, /OTP generated successfully: \$\{/);
  assert.doesNotMatch(source, /logger\.(info|warn|error|debug|trace)\([^)]*(newOtp\.code|code \? code)/);
});
