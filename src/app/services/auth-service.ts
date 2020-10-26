import { LoginRequest, PersonalDataRequest, SignUpRequest } from '@models/requests/auth';
import { JwtService } from '@services/index';

import bcrypt from 'bcrypt';
import { EnvConfig } from '@models/index';
import { HttpException } from '@exceptions/index';
import { AddressModel, UserModel, PersonalDataModel } from '@models/entities';
import { Address, PersonalData, Role, User } from '@database/accessors';

class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly environmentConfig: EnvConfig,
    private readonly user: User,
    private readonly personalData: PersonalData,
    private readonly address: Address,
    private readonly role: Role
  ) {}

  private readonly userQueryReturningStatement = [
    'user.user_guid',
    'user.email',
    'user.first_name',
    'user.middle_names',
    'user.last_name',
  ];

  private personalDataQueryReturningStatement = [
    'personal_data.cpf',
    'personal_data.rg',
    'personal_data.uf_rg',
    'personal_data.rg_emitter',
  ];

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

    const { role, address: addressPayload, ...remainingSignupRequest } = signUpRequest;

    let address: AddressModel | null = null;

    const user = await this.insertUserInTable(
      remainingSignupRequest,
      this.userQueryReturningStatement
    );

    const { user_guid } = user;

    if (addressPayload) {
      try {
        const {
          address_guid,
          ...addressQueryReturn
        }: AddressModel = await this.address.insertAddress(
          ['street', 'number', 'district', 'zip_code', 'complement', 'city', 'state', 'country'],
          addressPayload as AddressModel
        );

        await this.user.updateUser(user_guid, ['*'], {
          address_guid,
        });

        address = { address_guid, ...addressQueryReturn };
      } catch (error) {
        throw new HttpException('Invalid address payload', 710, 400);
      }
    }

    await this.setUserRole(user_guid as string, signUpRequest.role);

    if (!signUpRequest.personal_data) {
      throw new HttpException('User personal data must be provider', 711, 400);
    }

    const personal_data = await this.insertPersonalData(
      user_guid as ArrayLike<number>,
      signUpRequest.personal_data
    );

    return { ...user, personal_data, address };
  };

  signIn = async (loginRequest: LoginRequest) => {
    try {
      const user: UserModel = (await this.getUserFromTable(
        loginRequest,
        this.userQueryReturningStatement,
        this.personalDataQueryReturningStatement,
        true
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
    personalDataReturningStatement: string[],
    isLogin?: boolean
  ): Promise<(UserModel & { personal_data: PersonalDataModel }) | null | undefined> => {
    const { email, password } = loginRequest;

    if (!email || !password) {
      throw new HttpException('E-mail or password not provided', 702, 400);
    }

    try {
      const user: UserModel & {
        password_hash: string;
      } & PersonalDataModel = await this.user.getUserByEmail(email, [
        ...userReturningStatement,
        'password_hash',
      ]);

      if (!user && isLogin) {
        throw new HttpException('User not found', 704, 404);
      } else if (!user && !isLogin) {
        return null;
      }

      const { password_hash: passwordHashToCheckup } = user;

      const isPasswordValid = await bcrypt.compare(password, passwordHashToCheckup);

      if (!isPasswordValid) {
        throw new HttpException('Invalid e-mail or password', 703, 422);
      }

      const { user_guid } = user;

      const personal_data: PersonalDataModel = await this.personalData.getPersonalDataByUserGuid(
        user_guid,
        personalDataReturningStatement
      );

      const { password_hash, ...userReturn } = user;

      return {
        ...userReturn,
        user_guid,
        personal_data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  };

  private insertUserInTable = async (
    userData: Omit<SignUpRequest, 'role'>,
    returningStatement: string[]
  ): Promise<UserModel> => {
    const { password, personal_data, address, ...signUp } = userData;

    const password_hash = await bcrypt.hash(
      password,
      parseInt(this.environmentConfig.passwordHashRounds)
    );

    const finalSignupRequest = { ...signUp, password_hash };

    return await this.user.insertUser(returningStatement, finalSignupRequest);
  };

  private insertPersonalData = async (
    user_guid: string | ArrayLike<number>,
    personal_data: PersonalDataRequest
  ): Promise<Omit<PersonalDataModel, 'personal_data_guid'>> => {
    const queryReturningStatement = ['cpf', 'rg', 'uf_rg', 'rg_emitter'];

    const { personal_data_guid, ...personalData } = await this.personalData.insertPersonalData(
      user_guid,
      queryReturningStatement,
      personal_data
    );

    return personalData;
  };

  private setUserRole = async (user_guid: string, role_description: string) => {
    const role = await this.role.getRoleByDescription(role_description, [
      'role_guid',
      'description',
    ]);

    const { role_guid } = role;

    await this.role.setRoleForUser(role_guid, user_guid);
  };
}

export { AuthService };
