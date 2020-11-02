import { HttpException } from '@exceptions/index';

export const invalidAddressPayloadException = () => {
  return new HttpException('Invalid address payload', 802, 400);
};
