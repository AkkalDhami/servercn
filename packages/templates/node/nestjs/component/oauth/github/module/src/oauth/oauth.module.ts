import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GitHubStrategy } from './github.strategy';
import { OAuthController } from './oauth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'github' })],
  controllers: [OAuthController],
  providers: [GitHubStrategy],
})
export class OAuthModule {}
