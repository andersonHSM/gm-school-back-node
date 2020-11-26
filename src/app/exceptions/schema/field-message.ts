import { HttpException } from '@exceptions/index';

export const fieldMessageException = (message: string) => {
  return new HttpException(message, 901, 400);
};
