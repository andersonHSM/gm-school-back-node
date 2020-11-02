import { HttpException } from '@exceptions/index';

export const invalidClassPayloadException = () => {
  return new HttpException('Invalid class payload', 602, 400);
};
