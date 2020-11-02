import { HttpException } from '@exceptions/index';

export const userExistsWithProvidedEmailException = () => {
  return new HttpException('A user already exists with provided e-mail', 703, 400);
};
