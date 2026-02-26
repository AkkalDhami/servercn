import { Injectable } from '@nestjs/common';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { HashingService } from './hashing.interface';

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

@Injectable()
export class ScryptHashingService implements HashingService {
  async hash(data: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(data, salt, KEY_LENGTH)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async compare(data: string, hash: string): Promise<boolean> {
    const parts = hash.split(':');
    if (parts.length !== 2) {
      return false;
    }
    const [salt, key] = parts;
    const derivedKey = (await scryptAsync(data, salt, KEY_LENGTH)) as Buffer;
    const keyBuffer = Buffer.from(key, 'hex');
    return timingSafeEqual(derivedKey, keyBuffer);
  }
}
