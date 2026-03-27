import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("mvc cookie helper clears refreshToken using the refresh-token path", async () => {
  const helperSource = await readFile(
    new URL("./cookie.helper.ts", import.meta.url),
    "utf8"
  );

  assert.match(
    helperSource,
    /clearCookie\(res, "refreshToken", "\/api\/v1\/auth\/refresh-token"\)/
  );
  assert.match(
    helperSource,
    /res\.clearCookie\(cookie, \{\s*\.\.\.COOKIE_OPTIONS,\s*path\s*\}\)/
  );
});

test("mvc refreshToken controller no longer redundantly clears refreshToken", async () => {
  const controllerSource = await readFile(
    new URL("../controllers/auth.controller.ts", import.meta.url),
    "utf8"
  );

  assert.doesNotMatch(controllerSource, /clearCookie\(res, "refreshToken"\)/);
});
