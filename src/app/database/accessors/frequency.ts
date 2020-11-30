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

    if (!frequency) return null;

    return this.preparePayloadToReturn(frequency);
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

    return this.preparePayloadToReturn(frequency);
  };

  retrieveFrequency = async (frequency_guid: string, returningFields: string[]) => {
    const binaryGuid = uuidParse(frequency_guid);

    const frequency: FrequencyModel = await this.knex('frequency')
      .select(returningFields)
      .where('frequency_guid', binaryGuid)
      .whereNull('deleted_at')
      .first();

    if (!frequency) return null;

    return this.preparePayloadToReturn(frequency);
  };

  listFrequencies = async (returningFields: string[]) => {
    const frequencies: FrequencyModel[] = await this.knex('frequency')
      .select(returningFields)
      .whereNull('deleted_at');

    return frequencies.map(frequency => this.preparePayloadToReturn(frequency));
  };

  deleteFrequency = async (frequency_guid: string, returningFields: string[]) => {
    const binaryGuid = uuidParse(frequency_guid);

    const [frequency]: FrequencyModel[] = await this.knex('frequency')
      .where('frequency_guid', binaryGuid)
      .update('deleted_at', this.knex.fn.now())
      .returning([...returningFields, 'deleted_at']);

    if (!frequency) return null;

    return this.preparePayloadToReturn(frequency);
  };

  updateFrequency = async (
    frequency_guid: string,
    returningFields: string[],
    payload: Pick<FrequencyModel, 'is_present'>
  ) => {
    const binaryGuid = uuidParse(frequency_guid);

    const [frequency]: FrequencyModel[] = await this.knex('frequency')
      .where('frequency_guid', binaryGuid)
      .update(payload)
      .returning(returningFields)
      .whereNull('deleted_at');

    if (!frequency) return null;

    return this.preparePayloadToReturn(frequency);
  };

  private preparePayloadToReturn = (data: FrequencyModel) => {
    const {
      class_has_discipline_has_schedule_guid,
      is_present,
      user_guid,
      frequency_guid,
      ...remaining
    } = data;

    return {
      frequency_guid: uuidStringify(frequency_guid as ArrayLike<number>),
      class_has_discipline_has_schedule_guid: uuidStringify(
        class_has_discipline_has_schedule_guid as ArrayLike<number>
      ),
      user_guid: uuidStringify(user_guid as ArrayLike<number>),
      is_present,
      ...remaining,
    };
  };
}
