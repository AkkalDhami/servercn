import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('oauth/github')
export class GitHubOAuthController {
  @Get()
  @UseGuards(AuthGuard('github'))
  githubAuth() {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  githubAuthCallback(@Req() req: Request) {
    return { success: true, message: 'GitHub Auth Successful', data: req.user };
  }
}
