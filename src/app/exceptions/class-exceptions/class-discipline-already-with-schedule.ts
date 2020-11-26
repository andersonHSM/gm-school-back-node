import { HttpException } from '@exceptions/index';

export const classDisciplineAlredyWithScheduleException = () => {
  return new HttpException('Conflicting schedule for provided disciplines by class', 603, 400);
};
