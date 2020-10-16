import { BaseAuthRequest } from '@models/requests/auth/';

interface SignUpRequest extends BaseAuthRequest {
  firstName: string;
  middleNames?: string;
  lastName: string;
}

export { SignUpRequest };
