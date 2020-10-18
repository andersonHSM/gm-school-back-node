import { LoginRequest, PersonalDataRequest, SignUpRequest } from '@models/requests/auth';
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

  private userQueryReturningStatement = [
    'user_guid',
    'email',
    'first_name',
    'middle_names',
    'last_name',
  ];

  private personalDataQueryReturningStatement = ['cpf', 'rg', 'uf_rg', 'rg_emitter'];

  signUp = async (signUpRequest: SignUpRequest) => {
    const existingUser = await this.getUserFromTable(
      {
        email: signUpRequest.email,
        password: signUpRequest.password,
      },
      this.userQueryReturningStatement,
      this.personalDataQueryReturningStatement
    );

    if (existingUser) {
      throw new HttpException('A user already exists with supplied e-mail', 701, 400);
    }

    const user = await this.insertUserInTable(signUpRequest, this.userQueryReturningStatement);

    const { user_guid } = user;

    const personal_data = await this.insertPersonalData(
      user_guid as Uint8Array,
      signUpRequest.personal_data
    );

    return { ...user, personal_data };
  };

  signIn = async (loginRequest: LoginRequest) => {
    try {
      const user: UserModel = (await this.getUserFromTable(
        loginRequest,
        this.userQueryReturningStatement,
        this.personalDataQueryReturningStatement
      )) as UserModel;

      const { user_guid } = user;

      const token = this.jwtService.createToken(user_guid as string);

      return { token, ...user };
    } catch (error) {
      throw error;
    }
  };

  private getUserFromTable = async (
    loginRequest: { email: string; password: string },
    userReturningStatement: string[],
    personalDataReturningStatement: string[]
  ): Promise<UserModel | null | undefined> => {
    const { email, password } = loginRequest;

    if (!email || !password) {
      throw new HttpException('E-mail or password not provided', 702, 400);
    }

    try {
      const user: UserModel & { password_hash: string } = await this.knex('user')
        .select([...userReturningStatement, 'password_hash'])
        .where({ email })
        .first();

      if (!user) {
        return null;
      }

      const { password_hash: passwordHashToCheckup } = user;

      const isPasswordValid = await bcrypt.compare(password, passwordHashToCheckup);

      if (!isPasswordValid) {
        throw new HttpException('Invalid e-mail or password', 703, 422);
      }

      const { user_guid } = user;

      const personal_data: PersonalData = await this.knex('personal_data')
        .where({
          user_guid,
        })
        .select(personalDataReturningStatement)
        .first();

      const { password_hash, ...userReturn } = user;

      return { ...userReturn, user_guid: uuidStringfy(user_guid as Uint8Array), personal_data };
    } catch (error) {
      console.log(error);
    }
  };

  private insertUserInTable = async (
    userData: SignUpRequest,
    returningStatement: string[]
  ): Promise<UserModel> => {
    const { password, personal_data, ...signUp } = userData;

    const password_hash = await bcrypt.hash(
      password,
      parseInt(this.environmentConfig.passwordHashRounds)
    );

    const user_guid = uuidv4();

    const finalSignupRequest = { ...signUp, password_hash, user_guid: uuidParse(user_guid) };

    let queryReturn: any;
    try {
      queryReturn = await this.knex('user')
        .insert(finalSignupRequest)
        .returning(returningStatement);
    } catch (error) {
      throw new Error(error);
    }

    return { ...queryReturn[0], user_guid };
  };

  private insertPersonalData = async (
    user_guid: string | Uint8Array,
    personal_data: PersonalDataRequest
  ): Promise<PersonalData> => {
    const queryReturningStatement = ['cpf', 'rg', 'uf_rg', 'rg_emitter'];
    const personal_data_guid = uuidParse(uuidv4());

    const payload = {
      personal_data_guid,
      ...personal_data,
      user_guid: uuidParse(user_guid as string),
    };

    const [queryReturn] = await this.knex('personal_data')
      .insert(payload)
      .returning(queryReturningStatement);

    return queryReturn;
  };
}

export { AuthService };
