import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { HashingService } from './hashing.interface';

@Injectable()
export class Argon2HashingService implements HashingService {
  async hash(data: string): Promise<string> {
    return argon2.hash(data);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, data);
  }
}
