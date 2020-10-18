import { SignUpRequest } from '@models/requests/auth/';

interface UserModel extends SignUpRequest {
  user_guid: string;
}

export { UserModel };
