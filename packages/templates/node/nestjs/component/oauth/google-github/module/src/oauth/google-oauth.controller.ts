import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('oauth/google')
export class GoogleOAuthController {
  @Get()
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: Request) {
    return { success: true, message: 'Google Auth Successful', data: req.user };
  }
}
