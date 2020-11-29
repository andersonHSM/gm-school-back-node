import { HttpException } from '@exceptions/';

export const frequencyAlreadyExistsException = () => {
  return new HttpException('This frequency already exists', 1401, 422);
};
