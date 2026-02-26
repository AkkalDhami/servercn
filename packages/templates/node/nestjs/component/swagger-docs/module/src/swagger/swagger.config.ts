import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configure Swagger documentation for the NestJS application.
 * Call this function in your main.ts bootstrap before app.listen().
 *
 * @example
 * ```ts
 * import { setupSwagger } from './swagger/swagger.config';
 *
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   setupSwagger(app);
 *   await app.listen(3000);
 * }
 * ```
 */
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Auto-generated API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });
}
