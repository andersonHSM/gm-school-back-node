import { Address, PersonalData, Role, User } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { UserModel, AddressModel } from '@models/entities';
import { RolesEnum } from '@models/enums';
import { UserPatchRequestPayload } from '@models/requests/user';

class UserService {
  constructor(
    private readonly user: User,
    private readonly address: Address,
    private readonly personalData: PersonalData,
    private readonly role: Role
  ) {}

  private readonly userQueryReturningStatement = [
    'user.user_guid',
    'user.email',
    'user.first_name',
    'user.middle_names',
    'user.last_name',
  ];

  getAllUsers = async (user_guid: string) => {
    const role = await this.role.getRoleByUserGuid(user_guid);

    switch (role.description) {
      case RolesEnum.administrator:
        let users: UserModel[] = await this.user.getAllUsers(this.userQueryReturningStatement);

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

    await this.user.deleteUser(userToDeleteGuid);
  };

  updateUser = async (
    requestUserGuid: string,
    userToUpdateGuid: string,
    payload: UserPatchRequestPayload
  ) => {
    await this.validateUsersRoles(requestUserGuid, userToUpdateGuid);

    const { personal_data: personalDataPayload, address: addressPayload, ...userPayload } = payload;

    const user: UserModel & Pick<AddressModel, 'address_guid'> = await this.user.updateUser(
      userToUpdateGuid,
      [...this.userQueryReturningStatement, 'address_guid'],
      userPayload
    );

    const { address_guid, ...userReturn } = user;

    let address: AddressModel | undefined;

    if (addressPayload && !address_guid) {
      throw new HttpException('User must have a valid address to be updated', 709, 404);
    }

    address =
      address_guid && addressPayload
        ? await this.address.updateAddress(
            address_guid as ArrayLike<number>,
            Object.keys(addressPayload),
            addressPayload
          )
        : undefined;

    let personal_data;

    if (personalDataPayload) {
      const {
        personal_data_guid,
        ...personalDataQuery
      } = await this.personalData.updatePersonalData(
        userToUpdateGuid,
        Object.keys(personalDataPayload),
        personalDataPayload
      );

      personal_data = personalDataQuery;
    }

    return { ...userReturn, user_guid: userToUpdateGuid, personal_data, address };
  };

  private validateUsersRoles = async (requestUserGuid: string, targetUserGuid: string) => {
    const [requestUser, userToDelete] = await Promise.all([
      this.user.getUserByGuid(requestUserGuid, this.userQueryReturningStatement),
      this.user.getUserByGuid(targetUserGuid, this.userQueryReturningStatement),
    ]);

    if (!requestUser || !userToDelete) {
      throw new HttpException('User not found', 704, 404);
    }

    const requestUserRole = await this.role.getRoleByUserGuid(requestUserGuid);
    const userToDeleteRole = await this.role.getRoleByUserGuid(targetUserGuid);

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
