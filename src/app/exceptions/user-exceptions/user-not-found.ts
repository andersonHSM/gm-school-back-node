import { HttpException } from '@exceptions/http-exception';

export const userNotFoundException = () => {
  return new HttpException('User not found', 701, 404);
};
