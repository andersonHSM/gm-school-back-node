import { HttpException } from '@exceptions/index';

export const verifyTheFieldsException = () => {
  return new HttpException('Verify the fields', 901, 400);
};
