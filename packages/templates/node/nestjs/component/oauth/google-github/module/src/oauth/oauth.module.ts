import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { GitHubStrategy } from './github.strategy';
import { GoogleOAuthController } from './google-oauth.controller';
import { GitHubOAuthController } from './github-oauth.controller';

@Module({
  imports: [PassportModule],
  controllers: [GoogleOAuthController, GitHubOAuthController],
  providers: [GoogleStrategy, GitHubStrategy],
})
export class OAuthModule {}
