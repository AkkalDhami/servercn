import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("clearAuthCookies clears the refresh token using the refresh-token path", async () => {
  const source = await readFile(
    new URL("./cookie.helper.ts", import.meta.url),
    "utf8"
  );

  assert.match(
    source,
    /clearCookie\(res, "refreshToken", "\/api\/v1\/auth\/refresh-token"\)/
  );
  assert.match(
    source,
    /res\.clearCookie\(cookie, \{\s*\.\.\.COOKIE_OPTIONS,\s*path\s*\}\)/
  );
});
