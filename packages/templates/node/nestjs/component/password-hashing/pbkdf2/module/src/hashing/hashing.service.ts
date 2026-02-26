import { Injectable } from '@nestjs/common';
import { pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { HashingService } from './hashing.interface';

const pbkdf2Async = promisify(pbkdf2);
const ITERATIONS = 310000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';

@Injectable()
export class Pbkdf2HashingService implements HashingService {
  async hash(data: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = await pbkdf2Async(
      data,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      DIGEST,
    );
    return `${salt}:${ITERATIONS}:${derivedKey.toString('hex')}`;
  }

  async compare(data: string, hash: string): Promise<boolean> {
    const [salt, iterations, key] = hash.split(':');
    const derivedKey = await pbkdf2Async(
      data,
      salt,
      parseInt(iterations, 10),
      KEY_LENGTH,
      DIGEST,
    );
    const keyBuffer = Buffer.from(key, 'hex');
    return timingSafeEqual(derivedKey, keyBuffer);
  }
}
