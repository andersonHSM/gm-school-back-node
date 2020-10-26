import { AddressModel, UserModel } from '@models/entities';
import { BaseAuthRequest, PersonalDataRequest } from '@models/requests/auth/';

interface SignUpRequest
  extends BaseAuthRequest,
    Pick<UserModel, 'first_name' | 'middle_names' | 'last_name'> {
  role: string;
  personal_data: PersonalDataRequest;
  address?: Omit<AddressModel, 'address_guid'>;
}

export { SignUpRequest };
