import { Frequency } from '@database/accessors';
import { frequencyAlreadyExistsException, frequencyNotFoundException } from '@exceptions/frequency';
import { fieldMessageException } from '@exceptions/schema';
import { FrequencyModel } from '@models/entities';
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

    if (existingFrequency) {
      throw frequencyAlreadyExistsException();
    }

    return await this.frequency.insertFrequency(this.frequencyReturningFields, payload);
  };

  retrieveFrequency = async (frequency_guid: string) => {
    const frequency = await this.frequency.retrieveFrequency(
      frequency_guid,
      this.frequencyReturningFields
    );

    if (!frequency) throw frequencyNotFoundException();

    return frequency;
  };

  listFrequencies = async () => {
    return await this.frequency.listFrequencies(this.frequencyReturningFields);
  };

  deleteFrequency = async (frequency_guid: string) => {
    const frequency = await this.frequency.retrieveFrequency(
      frequency_guid,
      this.frequencyReturningFields
    );

    if (!frequency) throw frequencyNotFoundException();

    return await this.frequency.deleteFrequency(frequency_guid, this.frequencyReturningFields);
  };

  updateFrequency = async (frequency_guid: string, payload: Pick<FrequencyModel, 'is_present'>) => {
    const schema = Joi.object({
      is_present: Joi.boolean().required(),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw fieldMessageException(error.message);
    }
    const frequency = await this.frequency.updateFrequency(
      frequency_guid,
      this.frequencyReturningFields,
      payload
    );

    if (!frequency) throw frequencyNotFoundException();

    return frequency;
  };
}
