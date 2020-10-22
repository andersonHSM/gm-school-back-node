import { PersonalDataModel } from '@models/entities';
import { UserPatchRequestPayload } from '@models/requests/user';
import Knex from 'knex';
import { parse as uuidParse, stringify as uuidStringify } from 'uuid';

class PersonalData {
  constructor(private readonly knex: Knex) {}

  updatePersonalData = async (
    user_guid: string,
    fieldsToReturn: string[],
    payload: Pick<UserPatchRequestPayload, 'personal_data'>
  ): Promise<PersonalDataModel> => {
    const [{ personal_data_guid, ...personalData }]: PersonalDataModel[] = await this.knex(
      'personal_data'
    )
      .where({ user_guid: uuidParse(user_guid) })
      .update(payload)
      .returning(fieldsToReturn);

    return {
      ...personalData,
      personal_data_guid: uuidStringify(personal_data_guid as Uint8Array),
    };
  };
}

export { PersonalData };
