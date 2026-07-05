export type CookieOptionsType = {
  setAuthCookie?: (
    accessToken: string,
    refreshToken: string,
    sessionId: string
  ) => void;
};

export type UserSigninType = {
  email: string;
  password: string;
  ip: string;
  userAgent: string;
};

export type UpdatePasswordType = {
  email: string;
  password: string;
};

export type UpdateUserActivation = {
  id: number;
  deletedAt: Date | null;
  reActivateAvailableAt: Date | null;
  isDeleted: boolean;
};

export type ProviderType = "local" | "google" | "github" | "facebook";
