import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("mvc auth validators do not trim password inputs", async () => {
  const source = await readFile(
    new URL("./auth.ts", import.meta.url),
    "utf8"
  );

  assert.match(
    source,
    /export const passwordSchema = z\s*\.string\(\{ error: "Password must be a string" \}\)\s*\.min\(6,/
  );
  assert.doesNotMatch(
    source,
    /export const passwordSchema\s*=\s*z[\s\S]*?\.trim\(\)[\s\S]*?;\s*(?=export const|$)/
  );
  assert.doesNotMatch(
    source,
    /password\s*:\s*z\s*\.string\(\s*\{\s*error:\s*"Password must be a string"\s*\}\s*\)\s*\.trim\(\)\s*\.min\(\s*1\s*,/
  );
});
