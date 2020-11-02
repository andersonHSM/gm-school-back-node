import { HttpException } from '@exceptions/http-exception';

export const tokenMustBeProvidedException = () => {
  return new HttpException('Token must be provided', 1202, 422);
};
