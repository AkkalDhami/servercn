import { Module, Global } from '@nestjs/common';
import { ScryptHashingService } from './hashing.service';

@Global()
@Module({
  providers: [
    {
      provide: 'HASHING_SERVICE',
      useClass: ScryptHashingService,
    },
    ScryptHashingService,
  ],
  exports: ['HASHING_SERVICE', ScryptHashingService],
})
export class HashingModule {}
