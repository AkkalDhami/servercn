import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route as public (no authentication required).
 *
 * @example
 * ```ts
 * @Public()
 * @Get('status')
 * getStatus() {}
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
