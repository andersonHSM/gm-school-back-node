import { HttpException } from '@exceptions/http-exception';

export const invalidTokenProvidedException = () => {
  return new HttpException('Invalid token provided', 1201, 401);
};
