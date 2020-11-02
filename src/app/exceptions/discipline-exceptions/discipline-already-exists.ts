import { HttpException } from '@exceptions/index';

export const disciplineAlreadyExistsException = () => {
  return new HttpException('Discipline already exists', 1002, 400);
};
