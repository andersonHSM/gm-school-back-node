import { HttpException } from '@exceptions/';

export const frequencyAlreadyExistsException = () => {
  return new HttpException('Frequency already exists', 1401, 422);
};
