import { Module, Global } from '@nestjs/common';
import { BcryptHashingService } from './hashing.service';

@Global()
@Module({
  providers: [
    {
      provide: 'HASHING_SERVICE',
      useClass: BcryptHashingService,
    },
    BcryptHashingService,
  ],
  exports: ['HASHING_SERVICE', BcryptHashingService],
})
export class HashingModule {}
