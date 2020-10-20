import { HttpException } from '@exceptions/index';
import { UserModel, Role } from '@models/entities';
import { RolesEnum } from '@models/enums';
import { UserPatchRequestPayload } from '@models/requests/user';
import Knex from 'knex';
import { stringify as uuidStringify, parse as uuidParse } from 'uuid';

class UserService {
  constructor(private knex: Knex) {}

  private userQueryReturningStatement = [
    'user.user_guid',
    'user.email',
    'user.first_name',
    'user.middle_names',
    'user.last_name',
  ];

  getAllUsers = async (user_guid: string) => {
    const role = await this.getUserRole(user_guid);

    switch (role.description) {
      case RolesEnum.administrator:
        let users: UserModel[] = await this.knex('user')
          .select(this.userQueryReturningStatement)
          .whereNull('deleted_at');

        users = users.map(user => {
          const { user_guid } = user;

          return { ...user, user_guid: uuidStringify(user_guid as Uint8Array) };
        });

        return users;

      case RolesEnum.coordinator:
      case RolesEnum.professor:
      case RolesEnum.student:
      default:
        throw new HttpException('Insufficient permission', 707, 422);
    }
  };

  deleteUser = async (requestUserGuid: string, userToDeleteGuid: string) => {
    await this.validateUsersRoles(requestUserGuid, userToDeleteGuid);

    await this.knex('user')
      .where('user_guid', uuidParse(userToDeleteGuid))
      .update({ deleted_at: this.knex.fn.now() });
  };

  updateUser = async (
    requestUserGuid: string,
    userToUpdateGuid: string,
    payload: UserPatchRequestPayload
  ) => {
    await this.validateUsersRoles(requestUserGuid, userToUpdateGuid);

    const { personal_data: personalDataPayload, address: addressPayload, ...userPayload } = payload;

    const parsedUserGuid = uuidParse(userToUpdateGuid);

    const user = await this.knex('user')
      .where('user_guid', parsedUserGuid)
      .update(userPayload)
      .returning(this.userQueryReturningStatement);

    const personal_data = await this.knex('personal_data')
      .where('user_guid', parsedUserGuid)
      .update(personalDataPayload)
      .returning(Object.keys(personalDataPayload));

    return { ...user, user_guid: userToUpdateGuid, personal_data };
  };

  private getUserRole = async (user_guid: string): Promise<Role> => {
    const binaryUserGuid = uuidParse(user_guid);

    const user_role = await this.knex('user_role').where({ user_guid: binaryUserGuid }).first();

    if (!user_role) {
    }

    const role: Role = await this.knex('role')
      .where({ role_guid: user_role.role_guid })
      .whereNull('deleted_at')
      .first();

    return { ...role, role_guid: uuidStringify(role.role_guid as Uint8Array) };
  };

  private getUsersFromDb = async (user_guid: string): Promise<UserModel[]> => {
    return this.knex('user')
      .select(this.userQueryReturningStatement)
      .where('user_guid', uuidParse(user_guid))
      .whereNull('deleted_at');
  };

  private validateUsersRoles = async (requestUserGuid: string, targetUserGuid: string) => {
    const [[requestUser], [userToDelete]] = await Promise.all([
      this.getUsersFromDb(requestUserGuid),
      this.getUsersFromDb(targetUserGuid),
    ]);

    if (!requestUser || !userToDelete) {
      throw new HttpException('User not found', 704, 404);
    }

    const requestUserRole = await this.getUserRole(requestUserGuid);
    const userToDeleteRole = await this.getUserRole(targetUserGuid);

    if (
      requestUserGuid !== targetUserGuid &&
      requestUserRole.description !== RolesEnum.administrator
    ) {
      throw new HttpException('Insufficient permission', 707, 403);
    }

    if (
      userToDeleteRole.description === RolesEnum.administrator &&
      requestUserRole.description === RolesEnum.administrator &&
      requestUserGuid !== targetUserGuid
    ) {
      throw new HttpException('An administrator can not change an equivalent account', 708, 403);
    }
  };
}

export { UserService };
