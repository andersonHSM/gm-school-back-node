import { HttpException } from './http-exception';

export const unkownException = (message: string) => {
  return new HttpException(message, 999, 500);
};
