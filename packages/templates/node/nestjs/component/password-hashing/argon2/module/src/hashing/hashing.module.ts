import { Module, Global } from '@nestjs/common';
import { Argon2HashingService } from './hashing.service';

@Global()
@Module({
  providers: [
    {
      provide: 'HASHING_SERVICE',
      useClass: Argon2HashingService,
    },
    Argon2HashingService,
  ],
  exports: ['HASHING_SERVICE', Argon2HashingService],
})
export class HashingModule {}
