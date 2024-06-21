import crypto from 'node:crypto';

export const getMD5FromString = (string: string) => {
  return crypto.createHash('md5').update(string).digest('hex');
};
