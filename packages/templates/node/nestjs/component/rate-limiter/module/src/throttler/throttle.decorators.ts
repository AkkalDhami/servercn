import { SkipThrottle, Throttle } from '@nestjs/throttler';

/**
 * NestJS Throttler Decorators Usage Guide
 *
 * These decorators can be applied at the controller or route level
 * to customize rate limiting behavior.
 *
 * @example Skip throttling for a route
 * ```ts
 * @SkipThrottle()
 * @Get('public')
 * publicRoute() {}
 * ```
 *
 * @example Custom throttle for auth routes
 * ```ts
 * @Throttle({ short: { ttl: 60000, limit: 5 } })
 * @Post('login')
 * login() {}
 * ```
 *
 * @example Skip throttling for entire controller
 * ```ts
 * @SkipThrottle()
 * @Controller('webhooks')
 * export class WebhooksController {}
 * ```
 */

// Auth route throttle: 5 requests per minute
export const AuthThrottle = () =>
  Throttle({ short: { ttl: 60000, limit: 5 } });

// OTP route throttle: 6 requests per 10 minutes
export const OtpThrottle = () =>
  Throttle({ short: { ttl: 600000, limit: 6 } });

// Password reset throttle: 6 requests per 15 minutes
export const PasswordResetThrottle = () =>
  Throttle({ short: { ttl: 900000, limit: 6 } });

// Skip throttling entirely
export { SkipThrottle };
