import { HttpException } from '@exceptions/http-exception';

export const userMustHaveValidAddressToUpdate = () => {
  return new HttpException('User must have a valid address to be updated', 704, 404);
};
