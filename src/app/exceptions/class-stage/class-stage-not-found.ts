import { HttpException } from '@exceptions/index';

export const classStageNotFound = () => {
  return new HttpException('Class stage not found', 1101, 404);
};
