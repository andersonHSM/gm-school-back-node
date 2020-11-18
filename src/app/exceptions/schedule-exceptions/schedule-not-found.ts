import { HttpException } from '@exceptions/http-exception';

export const scheduleNotFoundException = () => {
  return new HttpException('Schedule not found', 1302, 404);
};
