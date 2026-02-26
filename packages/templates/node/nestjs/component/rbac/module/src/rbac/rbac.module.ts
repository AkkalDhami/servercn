import { Module, Global } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class RbacModule {}
