import { FrequencyModel } from '@models/entities';
import { InsertFrequencyPayload } from '@models/requests/frequency';
import { parse as uuidParse, stringify as uuidStringify, v4 as uuidv4 } from 'uuid';
import Knex from 'knex';

export class Frequency {
  constructor(private readonly knex: Knex) {}

  insertFrequency = async (returningFields: string[], payload: InsertFrequencyPayload) => {
    const frequency_guid = uuidv4();
    const { class_has_discipline_has_schedule_guid, user_guid, is_present } = payload;
    const finalPayload = {
      frequency_guid: uuidParse(frequency_guid),
      class_has_discipline_has_schedule_guid: uuidParse(
        class_has_discipline_has_schedule_guid as string
      ),
      user_guid: uuidParse(user_guid as string),
      is_present,
    };

    const [frequency]: FrequencyModel[] = await this.knex('frequency')
      .insert(finalPayload)
      .returning(returningFields);

    const {
      class_has_discipline_has_schedule_guid: queryClassScheduleGuid,
      user_guid: queryUserGuid,
      is_present: queryIsPresent,
    } = frequency;

    return {
      frequency_guid,
      class_has_discipline_has_schedule_guid: uuidStringify(
        queryClassScheduleGuid as ArrayLike<number>
      ),
      user_guid: uuidStringify(queryUserGuid as ArrayLike<number>),
      is_present: queryIsPresent,
    };
  };

  getFrequencyByPayload = async (
    returningFields: string[],
    payload: Omit<InsertFrequencyPayload, 'is_present'>
  ) => {
    const {
      class_has_discipline_has_schedule_guid: classHasDisciplineHasSchedulePayloadGuid,
      user_guid: userPayloadGuid,
    } = payload;

    const finalPayload = {
      class_has_discipline_has_schedule_guid: uuidParse(
        classHasDisciplineHasSchedulePayloadGuid as string
      ),
      user_guid: uuidParse(userPayloadGuid as string),
    };
    const frequency: FrequencyModel = await this.knex('frequency')
      .select(returningFields)
      .where(finalPayload)
      .whereNull('deleted_at')
      .first();

    if (!frequency) return null;

    const {
      class_has_discipline_has_schedule_guid,
      frequency_guid,
      user_guid,
      is_present,
    } = frequency;

    return {
      class_has_discipline_has_schedule_guid: uuidStringify(
        class_has_discipline_has_schedule_guid as ArrayLike<number>
      ),
      user_guid: uuidStringify(user_guid as ArrayLike<number>),
      frequency_guid: uuidStringify(frequency_guid as ArrayLike<number>),
      is_present,
    };
  };
}
