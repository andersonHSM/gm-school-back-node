import { SignUpRequest } from '@models/requests/auth';
import { JwtService } from '@services/index';
import Knex from 'knex';

class AuthService {
  constructor(private jwtService: JwtService, private knex: Knex) {}

  signUp = async (signUpRequest: SignUpRequest) => {
    await this.knex('user').insert(signUpRequest);
  };

  signIn = (signInRequest: any) => {
    this.jwtService.createToken(signInRequest.id);
  };
}

export { AuthService };
