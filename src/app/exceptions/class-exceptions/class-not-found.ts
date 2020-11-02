import { HttpException } from '@exceptions/http-exception';

export const classNotFoundException = () => {
  return new HttpException('Class not found', 601, 404);
};
