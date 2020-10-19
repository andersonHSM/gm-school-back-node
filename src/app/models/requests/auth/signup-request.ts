import { BaseAuthRequest, PersonalDataRequest } from '@models/requests/auth/';

interface SignUpRequest extends BaseAuthRequest {
  first_name: string;
  middle_names?: string;
  last_name: string;
  role: string;
  personal_data: PersonalDataRequest;
}

export { SignUpRequest };
