import { PersonalDataRequest } from '@models/requests/auth';

interface PersonalData extends PersonalDataRequest {
  personal_data_guid: string;
}

export { PersonalData };
