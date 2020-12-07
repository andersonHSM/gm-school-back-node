import { FrequencyModel } from '@models/entities';

export type InsertFrequencyPayload = Omit<FrequencyModel, 'frequency_guid'>;
