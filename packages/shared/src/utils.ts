import { Truthy } from './types';

export namespace Utils {
  export const isDev = process.env.NODE_ENV !== 'production';

  export const isLambda = 'AWS_LAMBDA_FUNCTION_VERSION' in process.env;

  export const isCorrectUrl = (url: string) => {
    try {
      const { protocol } = new URL(url);

      return 'https:' === protocol;
    } catch {
      return false;
    }
  };

  export const isBetween = (x: number, min: number, max: number) => {
    return x >= min && x <= max;
  };

  export const zeroPad = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  export const truthy = <T>(value: T): value is Truthy<T> => {
    return !!value;
  };
}
