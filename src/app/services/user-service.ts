import Knex from 'knex';

class UserService {
  constructor(private knex: Knex) {}

  getAllUsersFromDataBase = (user_guid: string) => {
    console.log({ user_guid, knex: this.knex });
  };
}

export { UserService };
