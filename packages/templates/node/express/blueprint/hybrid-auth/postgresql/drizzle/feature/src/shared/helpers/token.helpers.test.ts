import test from "node:test";
import assert from "node:assert/strict";
import {
  createTokenLogFingerprint,
  generateHashedToken
} from "./token.helpers.ts";

test("createTokenLogFingerprint never includes the raw token in log metadata", () => {
  const token = "delete-account-raw-token";
  const tokenFingerprint = createTokenLogFingerprint(token);
  const logMetadata = JSON.stringify({
    userId: "user-123",
    tokenFingerprint
  });

  assert.equal(tokenFingerprint, generateHashedToken(token).slice(0, 12));
  assert.notEqual(tokenFingerprint, token);
  assert.equal(logMetadata.includes(token), false);
});
