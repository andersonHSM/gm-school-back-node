import { HttpException } from '@exceptions/http-exception';

export const classStageAlreadyExistsException = () => {
  return new HttpException('Class stage already exists', 1102, 400);
};
