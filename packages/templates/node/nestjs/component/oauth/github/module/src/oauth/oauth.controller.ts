import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('oauth/github')
export class OAuthController {
  /**
   * Initiates GitHub OAuth flow
   * GET /oauth/github
   */
  @Get()
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // Guard redirects to GitHub
  }

  /**
   * GitHub OAuth callback
   * GET /oauth/github/callback
   */
  @Get('callback')
  @UseGuards(AuthGuard('github'))
  githubAuthCallback(@Req() req: Request) {
    return {
      success: true,
      message: 'Auth Successful',
      data: req.user,
    };
  }
}
