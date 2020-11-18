import { HttpException } from '@exceptions/http-exception';

export const scheduleAlreadyExistsException = () => {
  return new HttpException('This schedule already exists', 1301, 422);
};
