import { Address, PersonalData, UserModel } from '@models/entities';

export interface UserPatchRequestPayload extends Omit<UserModel, 'user_guid'> {
  personal_data: Omit<PersonalData, 'personal_data_guid'>;
  address: Omit<Address, 'address_guid'>;
}
