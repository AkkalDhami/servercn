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

const createReturningChain = <T>(result: T) => ({
  where: () => ({
    returning: async () => [result]
  })
});

test("oauth service auto-links verified users", async t => {
  applyTestEnv();

  const [{ OAuthService }, { AuthService }, { default: db }] = await Promise.all([
    import("./oauth.service.ts"),
    import("./auth.service.ts"),
    import("../configs/db.ts")
  ]);

  const existingUser = {
    id: "user-1",
    role: "user",
    provider: "local",
    isEmailVerified: false
  };
  const updatedUser = {
    ...existingUser,
    provider: "google",
    providerId: "google-123",
    avatar: { url: "https://example.com/avatar.png" },
    isEmailVerified: true
  };

  t.mock.method(db.query.users, "findFirst", async () => existingUser as never);
  const updateMock = t.mock.method(db, "update", () => ({
    set: () => createReturningChain(updatedUser)
  }) as never);
  const insertMock = t.mock.method(db, "insert", () => {
    throw new Error("insert should not be called");
  });
  const handleTokenMock = t.mock.method(
    AuthService,
    "handleToken",
    async () => undefined
  );

  const result = await OAuthService.handleOAuthLogin(
    {
      provider: "google",
      providerId: "google-123",
      name: "Verified User",
      email: "verified@example.com",
      isEmailVerified: true,
      avatar: "https://example.com/avatar.png",
      ip: "127.0.0.1",
      userAgent: "test-agent"
    },
    {}
  );

  assert.equal(updateMock.mock.callCount(), 1);
  assert.equal(insertMock.mock.callCount(), 0);
  assert.equal(handleTokenMock.mock.callCount(), 1);
  assert.equal(result.provider, "google");
});

test("oauth service allows same-provider linking even when the incoming email is unverified", async t => {
  applyTestEnv();

  const [{ OAuthService }, { AuthService }, { default: db }] = await Promise.all([
    import("./oauth.service.ts"),
    import("./auth.service.ts"),
    import("../configs/db.ts")
  ]);

  const existingUser = {
    id: "user-2",
    role: "user",
    provider: "github",
    isEmailVerified: false
  };
  const updatedUser = {
    ...existingUser,
    providerId: "github-123",
    avatar: { url: "https://example.com/avatar.png" }
  };

  t.mock.method(db.query.users, "findFirst", async () => existingUser as never);
  const updateMock = t.mock.method(db, "update", () => ({
    set: () => createReturningChain(updatedUser)
  }) as never);
  const insertMock = t.mock.method(db, "insert", () => {
    throw new Error("insert should not be called");
  });
  const handleTokenMock = t.mock.method(
    AuthService,
    "handleToken",
    async () => undefined
  );

  const result = await OAuthService.handleOAuthLogin(
    {
      provider: "github",
      providerId: "github-123",
      name: "Same Provider",
      email: "same-provider@example.com",
      isEmailVerified: false,
      avatar: "https://example.com/avatar.png",
      ip: "127.0.0.1",
      userAgent: "test-agent"
    },
    {}
  );

  assert.equal(updateMock.mock.callCount(), 1);
  assert.equal(insertMock.mock.callCount(), 0);
  assert.equal(handleTokenMock.mock.callCount(), 1);
  assert.equal(result.provider, "github");
});

test("oauth service blocks auto-linking for unverified users on a different provider", async t => {
  applyTestEnv();

  const [{ OAuthService }, { AuthService }, { default: db }, { ApiError }] =
    await Promise.all([
      import("./oauth.service.ts"),
      import("./auth.service.ts"),
      import("../configs/db.ts"),
      import("../utils/api-error.ts")
    ]);

  const existingUser = {
    id: "user-3",
    role: "user",
    provider: "google",
    isEmailVerified: false
  };

  t.mock.method(db.query.users, "findFirst", async () => existingUser as never);
  const updateMock = t.mock.method(db, "update", () => {
    throw new Error("update should not be called");
  });
  const insertMock = t.mock.method(db, "insert", () => {
    throw new Error("insert should not be called");
  });
  const handleTokenMock = t.mock.method(
    AuthService,
    "handleToken",
    async () => undefined
  );

  await assert.rejects(
    () =>
      OAuthService.handleOAuthLogin(
        {
          provider: "github",
          providerId: "github-123",
          name: "Blocked User",
          email: "blocked@example.com",
          isEmailVerified: false,
          avatar: undefined,
          ip: "127.0.0.1",
          userAgent: "test-agent"
        },
        {}
      ),
    (error: unknown) =>
      error instanceof ApiError &&
      error.message ===
        "Please sign in with your existing provider to link this account."
  );

  assert.equal(updateMock.mock.callCount(), 0);
  assert.equal(insertMock.mock.callCount(), 0);
  assert.equal(handleTokenMock.mock.callCount(), 0);
});
