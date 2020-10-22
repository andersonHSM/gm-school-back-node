import { RoleModel } from '@models/entities';
import Knex from 'knex';
import { parse as uuidParse, stringify as uuidStringify } from 'uuid';

class Role {
  constructor(private readonly knex: Knex) {}

  getRoleByUser = async (user_guid: string): Promise<RoleModel> => {
    const binaryUserGuid = uuidParse(user_guid);

    const user_role = await this.knex('user_role').where({ user_guid: binaryUserGuid }).first();

    const role: RoleModel = await this.knex('role')
      .where({ role_guid: user_role.role_guid })
      .whereNull('deleted_at')
      .first();

    return { ...role, role_guid: uuidStringify(role.role_guid as Uint8Array) };
  };
}

export { Role };
