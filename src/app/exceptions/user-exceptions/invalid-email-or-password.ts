import { HttpException } from '@exceptions/http-exception';

export const invalidEmailOrPasswordException = () => {
  return new HttpException('Invalid e-mail or password exception', 705, 401);
};
