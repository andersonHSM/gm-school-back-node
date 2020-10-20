import { PersonalData } from '@models/entities';

type PersonalDataRequest = Partial<Omit<PersonalData, 'personal_data_guid'>>;

export { PersonalDataRequest };
