import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to define required roles for a route or controller.
 *
 * @example
 * ```ts
 * @Roles('admin', 'moderator')
 * @UseGuards(AuthGuard, RolesGuard)
 * @Get('dashboard')
 * getDashboard() {}
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
