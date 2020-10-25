import { AddressModel, RoleModel, UserModel } from '@models/entities';
import { SignUpRequest } from '@models/requests/auth';
import { UserPatchRequestPayload } from '@models/requests/user';
import Knex from 'knex';

import { parse as uuidParse, stringify as uuidStringify, v4 as uuidv4 } from 'uuid';

class User {
  constructor(private readonly knex: Knex) {}

  getUserByGuid = async (user_guid: string, returningFields: string[]): Promise<UserModel> => {
    const user: UserModel = await this.knex('user')
      .select([...returningFields, 'user_guid'])
      .where({ user_guid: uuidParse(user_guid) })
      .whereNull('deleted_at')
      .first();

    return { ...user, user_guid: uuidStringify(user.user_guid as ArrayLike<number>) };
  };

  getUserByEmail = async (email: string, returningFields: string[]): Promise<UserModel & any> => {
    const { user_guid, ...user }: UserModel = await this.knex('user')
      .select(returningFields)
      .where({ email })
      .whereNull('deleted_at')
      .first();

    return { ...user, user_guid: uuidStringify(user_guid as ArrayLike<number>) };
  };

  getAllUsers = async (returningFields: string[]): Promise<UserModel[]> => {
    let users = await this.knex('user').select(returningFields).whereNull('deleted_at');

    users = users.map(user => {
      const { user_guid } = user;

      return { ...user, user_guid: uuidStringify(user_guid as ArrayLike<number>) };
    });

    return users;
  };

  insertUser = async (
    returningFields: string[],
    payload: Pick<SignUpRequest, 'email' | 'first_name' | 'last_name' | 'middle_names'> & {
      password_hash: string;
    }
  ): Promise<UserModel> => {
    const user_guid = uuidv4();

    const [{ user_guid: queryUserGuid, ...user }]: UserModel[] = await this.knex('user')
      .insert({ ...payload, user_guid: uuidParse(user_guid) })
      .returning(returningFields);

    return { ...user, user_guid };
  };

  updateUser = async (
    user_guid: string | ArrayLike<number>,
    returningFields: string[],
    payload: Partial<UserPatchRequestPayload> & { address_guid?: string | ArrayLike<number> }
  ): Promise<UserModel[] & any> => {
    const { address_guid } = payload;

    if (address_guid) {
      payload.address_guid = uuidParse(address_guid as string);
    }

    const [user]: UserModel[] = await this.knex('user')
      .where({ user_guid: typeof user_guid === 'string' ? uuidParse(user_guid) : user_guid })
      .update(payload)
      .returning(returningFields);

    return { ...user, user_guid: uuidStringify(user.user_guid as ArrayLike<number>) };
  };

  deleteUser = async (user_guid: string): Promise<void> => {
    await this.knex('user')
      .where({ user_guid: uuidParse(user_guid) })
      .update({ deleted_at: this.knex.fn.now() });
  };
}

export { User };
