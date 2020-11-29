import { Frequency } from '@database/accessors';
import { frequencyAlreadyExistsException } from '@exceptions/frequency';
import { fieldMessageException } from '@exceptions/schema';
import { InsertFrequencyPayload } from '@models/requests/frequency';
import Joi from 'joi';

export class FrequencyService {
  constructor(private readonly frequency: Frequency) {}

  private frequencyReturningFields = [
    'frequency.frequency_guid',
    'frequency.user_guid',
    'frequency.is_present',
    'frequency.class_has_discipline_has_schedule_guid',
  ];

  insertFrequency = async (payload: InsertFrequencyPayload) => {
    const schema = Joi.object({
      class_has_discipline_has_schedule_guid: Joi.string().required(),
      user_guid: Joi.string().required(),

      is_present: Joi.boolean(),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw fieldMessageException(error.message);
    }

    const existingFrequency = await this.frequency.getFrequencyByPayload(
      this.frequencyReturningFields,
      payload
    );

    console.log(existingFrequency);

    if (existingFrequency) {
      throw frequencyAlreadyExistsException();
    }

    return await this.frequency.insertFrequency(this.frequencyReturningFields, payload);
  };
}
