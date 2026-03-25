export class JwtError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JwtError";
  }
}

export class JwtExpiredError extends JwtError {
  constructor() {
    super("Token expired");
  }
}

export class JwtInvalidError extends JwtError {
  constructor() {
    super("Invalid token");
  }
}
