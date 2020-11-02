import { HttpException } from '@exceptions/index';

export const disciplineNotFoundException = () => {
  new HttpException('Discipline not found', 1001, 404);
};
