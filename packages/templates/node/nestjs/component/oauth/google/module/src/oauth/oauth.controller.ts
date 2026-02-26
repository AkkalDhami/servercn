import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('oauth/google')
export class OAuthController {
  /**
   * Initiates Google OAuth flow
   * GET /oauth/google
   */
  @Get()
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Guard redirects to Google
  }

  /**
   * Google OAuth callback
   * GET /oauth/google/callback
   */
  @Get('callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: Request) {
    // req.user contains the validated user from GoogleStrategy
    return {
      success: true,
      message: 'Auth Successful',
      data: req.user,
    };
  }
}
