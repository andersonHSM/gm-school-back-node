import { HttpException } from '@exceptions/http-exception';

export const addressNotFoundException = () => {
  return new HttpException('Address not found', 801, 404);
};
