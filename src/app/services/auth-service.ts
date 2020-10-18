import { PersonalDataRequest, SignUpRequest } from '@models/requests/auth';
import { JwtService } from '@services/index';
import Knex from 'knex';
import bcrypt from 'bcrypt';
import { EnvConfig } from '@models/index';
import { v4 as uuidv4, parse as uuidParse, stringify as uuidStringfy } from 'uuid';
import { HttpException } from '../exception';
import { UserModel } from '@models/entities';
import { PersonalData } from '@models/entities/personal-data-model';

class AuthService {
  constructor(
    private jwtService: JwtService,
    private knex: Knex,
    private environmentConfig: EnvConfig
  ) {}

  signUp = async (signUpRequest: SignUpRequest) => {
    const userQueryReturningStatement = [
      'user_guid',
      'email',
      'first_name',
      'middle_names',
      'last_name',
    ];

    let [existingUser] = await this.knex('user')
      .where({ email: signUpRequest.email })
      .select(userQueryReturningStatement);

    if (existingUser) {
      throw new HttpException('A user already exists with supplied e-mail', 701, 400);
    }

    const user = await this.insertUserInTable(signUpRequest, userQueryReturningStatement);
    const { user_guid } = user;

    const personal_data = await this.insertPersonalData(user_guid, signUpRequest.personal_data);

    return { ...user, personal_data };
  };

  signIn = (signInRequest: any) => {
    this.jwtService.createToken(signInRequest.id);
  };

  private insertUserInTable = async (
    userData: SignUpRequest,
    returningStatement: string[]
  ): Promise<UserModel> => {
    const { password, personal_data, ...signUp } = userData;

    const password_hash = await bcrypt.hash(password, +this.environmentConfig.passwordHashRounds);
    const user_guid = uuidv4();

    const finalSignupRequest = { ...signUp, password_hash, user_guid: uuidParse(user_guid) };

    const [queryReturn] = await this.knex('user')
      .insert(finalSignupRequest)
      .returning(returningStatement);

    return { ...queryReturn, user_guid: uuidStringfy(queryReturn.user_guid) };
  };

  private insertPersonalData = async (
    user_guid: string,
    personal_data: PersonalDataRequest
  ): Promise<PersonalData> => {
    const queryReturningStatement = ['cpf', 'rg', 'uf_rg', 'rg_emitter'];
    const personal_data_guid = uuidParse(uuidv4());

    const payload = { personal_data_guid, ...personal_data, user_guid: uuidParse(user_guid) };

    const [queryReturn] = await this.knex('personal_data')
      .insert(payload)
      .returning(queryReturningStatement);

    return queryReturn;
  };
}

export { AuthService };
