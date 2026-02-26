import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

/**
 * Configure security headers for the NestJS application.
 * Call this function in your main.ts bootstrap before app.listen().
 *
 * @example
 * ```ts
 * import { configureSecurityHeaders } from './security/security.config';
 *
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   const configService = app.get(ConfigService);
 *   configureSecurityHeaders(app, configService);
 *   await app.listen(3000);
 * }
 * ```
 */
export function configureSecurityHeaders(
  app: INestApplication,
  configService: ConfigService,
) {
  // Helmet sets various security-related HTTP headers
  app.use(helmet());

  // Configure CORS
  const corsOrigin = configService.get('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin || '*',
    credentials: !!corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
}
