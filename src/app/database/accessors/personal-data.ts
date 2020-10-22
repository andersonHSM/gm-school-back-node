import { PersonalDataModel } from '@models/entities';
import { PersonalDataRequest } from '@models/requests/auth';
import Knex from 'knex';
import { parse as uuidParse, stringify as uuidStringify, v4 as uuidv4 } from 'uuid';

class PersonalData {
  constructor(private readonly knex: Knex) {}

  insertPersonalData = async (
    user_guid: string | ArrayLike<number>,
    returningFields: string[],
    payload: PersonalDataRequest
  ): Promise<PersonalDataModel> => {
    const personal_data_guid = uuidv4();

    const finalPayload = {
      personal_data_guid: uuidParse(personal_data_guid),
      user_guid: typeof user_guid === 'string' ? uuidParse(user_guid) : user_guid,
      ...payload,
    };

    const [
      { personal_data_guid: queryGuid, ...personalData },
    ]: PersonalDataModel[] = await this.knex('personal_data')
      .insert(finalPayload)
      .returning(returningFields);

    return { ...personalData, personal_data_guid };
  };

  getPersonalDataByUserGuid = async (
    user_guid: string | ArrayLike<number>,
    returningFields: string[]
  ): Promise<PersonalDataModel> => {
    const { personal_data_guid, ...personalData }: PersonalDataModel = await this.knex(
      'personal_data'
    )
      .where({
        user_guid: typeof user_guid === 'string' ? uuidParse(user_guid) : user_guid,
      })
      .select([...returningFields, 'personal_data_guid'])
      .first();

    return {
      ...personalData,
      personal_data_guid: uuidStringify(personal_data_guid as ArrayLike<number>),
    };
  };

  updatePersonalData = async (
    user_guid: string,
    fieldsToReturn: string[],
    payload: Omit<PersonalDataModel, 'personal_data_guid'>
  ): Promise<PersonalDataModel> => {
    const [{ personal_data_guid, ...personalData }]: PersonalDataModel[] = await this.knex(
      'personal_data'
    )
      .where({ user_guid: uuidParse(user_guid) })
      .update(payload)
      .returning([...fieldsToReturn, 'personal_data_guid']);

    return {
      ...personalData,
      personal_data_guid: uuidStringify(personal_data_guid as ArrayLike<number>),
    };
  };
}

export { PersonalData };
