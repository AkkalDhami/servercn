export interface OtpResult {
  code: string;
  hashCode: string;
  expiresAt: string;
}

export interface TokenResult {
  token: string;
  hashedToken: string;
}
