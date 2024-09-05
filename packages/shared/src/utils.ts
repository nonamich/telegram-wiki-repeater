import crypto from 'node:crypto';

import { Truthy } from './types';

export class Utils {
  static isDev = process.env.NODE_ENV !== 'production';

  static zeroPad(num: number) {
    return num.toString().padStart(2, '0');
  }

  static truthy<T>(value: T): value is Truthy<T> {
    return !!value;
  }

  static capitalizeFirstLetter(text: string) {
    return text[0].toUpperCase() + text.slice(1);
  }

  static creteMD5Hash(string: string) {
    return crypto.createHash('md5').update(string).digest('hex');
  }
}
