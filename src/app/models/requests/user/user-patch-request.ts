import { AddressModel, PersonalDataModel, UserModel } from '@models/entities';

export interface UserPatchRequestPayload extends Omit<UserModel, 'user_guid'> {
  personal_data: Omit<PersonalDataModel, 'personal_data_guid'>;
  address: Omit<AddressModel, 'address_guid'>;
}
