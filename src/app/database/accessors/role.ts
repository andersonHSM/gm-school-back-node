import { RoleModel } from '@models/entities';
import Knex from 'knex';
import { parse as uuidParse, stringify as uuidStringify, v4 as uuidv4 } from 'uuid';

class Role {
  constructor(private readonly knex: Knex) {}

  getRoleByDescription = async (
    description: string,
    returningFields: string[]
  ): Promise<RoleModel> => {
    const { role_guid, ...role }: RoleModel = await this.knex('role')
      .select(returningFields)
      .where({ description })
      .whereNull('deleted_at')
      .first();

    return { ...role, role_guid: uuidStringify(role_guid as ArrayLike<number>) };
  };

  setRoleForUser = async (
    role_guid: string | ArrayLike<number>,
    user_guid: string | ArrayLike<number>
  ) => {
    const user_role_guid = uuidParse(uuidv4());

    await this.knex('user_role').insert({
      user_role_guid,
      user_guid: typeof user_guid === 'string' ? uuidParse(user_guid) : user_guid,
      role_guid: typeof role_guid === 'string' ? uuidParse(role_guid) : role_guid,
    });
  };

  getRoleByUserGuid = async (user_guid: string): Promise<RoleModel> => {
    const binaryUserGuid = uuidParse(user_guid);

    const user_role = await this.knex('user_role').where({ user_guid: binaryUserGuid }).first();

    const role: RoleModel = await this.knex('role')
      .where({ role_guid: user_role.role_guid })
      .whereNull('deleted_at')
      .first();

    return { ...role, role_guid: uuidStringify(role.role_guid as ArrayLike<number>) };
  };
}

export { Role };
