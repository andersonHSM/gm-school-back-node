import { SignUpRequest } from '@models/requests/auth/';

interface UserModel extends SignUpRequest {
  user_guid: Uint8Array | string;
}

export { UserModel };
