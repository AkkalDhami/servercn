import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { OAuthController } from './oauth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' })],
  controllers: [OAuthController],
  providers: [GoogleStrategy],
})
export class OAuthModule {}
