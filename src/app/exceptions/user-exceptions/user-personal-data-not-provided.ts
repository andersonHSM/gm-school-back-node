import { HttpException } from '@exceptions/index';

export const userPersonalDataNotProvidedException = () => {
  return new HttpException('User personal data must be provided', 702, 400);
};
