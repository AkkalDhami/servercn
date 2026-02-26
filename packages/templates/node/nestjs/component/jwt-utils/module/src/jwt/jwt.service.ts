import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, TokenPair } from './jwt.interface';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: REFRESH_TOKEN_EXPIRY,
      },
    );
  }

  generateTokenPair(payload: JwtPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload.userId),
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  verifyRefreshToken(token: string): { userId: string } {
    return this.jwtService.verify<{ userId: string }>(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }
}
