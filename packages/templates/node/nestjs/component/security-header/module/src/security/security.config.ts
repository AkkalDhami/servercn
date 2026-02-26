import { INestApplication } from '@nestjs/common';
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
 *   configureSecurityHeaders(app);
 *   await app.listen(3000);
 * }
 * ```
 */
export function configureSecurityHeaders(app: INestApplication) {
  // Helmet sets various security-related HTTP headers
  app.use(helmet());

  // Configure CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
}
