import { UserModel } from '@models/entities';
import { UserPatchRequestPayload } from '@models/requests/user';
import Knex from 'knex';

import { parse as uuidParse, stringify as uuidStringify } from 'uuid';

class User {
  constructor(private readonly knex: Knex) {}

  getUser = async (user_guid: string, fieldsToReturn: string[]): Promise<UserModel> => {
    const [user]: UserModel[] = await this.knex('user')
      .select(fieldsToReturn)
      .where({ user_guid: uuidParse(user_guid) })
      .whereNull('deleted_at');

    return { ...user, user_guid: uuidStringify(user.user_guid as Uint8Array) };
  };

  getAllUsers = async (fieldsToReturn: string[]): Promise<UserModel[]> => {
    let users = await this.knex('user').select(fieldsToReturn).whereNull('deleted_at');

    users = users.map(user => {
      const { user_guid } = user;

      return { ...user, user_guid: uuidStringify(user_guid as Uint8Array) };
    });

    return users;
  };

  updateUser = async (
    user_guid: string,
    returningFields: string[],
    payload: Pick<UserPatchRequestPayload, 'first_name' | 'last_name' | 'middle_names'>
  ): Promise<UserModel[] & any> => {
    const [user]: UserModel[] = await this.knex('user')
      .where({ user_guid: uuidParse(user_guid) })
      .update(payload)
      .returning(returningFields);

    return { ...user, user_guid: uuidStringify(user.user_guid as Uint8Array) };
  };

  deleteUser = async (user_guid: string): Promise<void> => {
    await this.knex('user')
      .where({ user_guid: uuidParse(user_guid) })
      .update({ deleted_at: this.knex.fn.now() });
  };
}

export { User };
