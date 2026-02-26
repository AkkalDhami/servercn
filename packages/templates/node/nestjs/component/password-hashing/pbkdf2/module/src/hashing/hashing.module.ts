import { Module, Global } from '@nestjs/common';
import { Pbkdf2HashingService } from './hashing.service';

@Global()
@Module({
  providers: [
    {
      provide: 'HASHING_SERVICE',
      useClass: Pbkdf2HashingService,
    },
    Pbkdf2HashingService,
  ],
  exports: ['HASHING_SERVICE', Pbkdf2HashingService],
})
export class HashingModule {}
