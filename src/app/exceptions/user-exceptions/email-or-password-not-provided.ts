import { HttpException } from '@exceptions/http-exception';

export const emailOrPasswordNotProvidedException = () => {
  return new HttpException('E-mail or password not provided', 702, 400);
};
