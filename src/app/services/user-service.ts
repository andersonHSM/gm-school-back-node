import { Address, PersonalData, Role, User } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { UserModel, AddressModel } from '@models/entities';
import { UserPatchRequestPayload } from '@models/requests/user';

class UserService {
  constructor(
    private readonly user: User,
    private readonly address: Address,
    private readonly personalData: PersonalData
  ) {}

  private readonly userQueryReturningStatement = [
    'user.user_guid',
    'user.email',
    'user.first_name',
    'user.middle_names',
    'user.last_name',
  ];

  getUser = async (user_guid: string) => {
    try {
      return await this.user.getUserByGuid(user_guid, this.userQueryReturningStatement);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'user_guid' of undefined":
        default:
          throw new HttpException(`User not found`, 704, 404);
      }
    }
  };

  getAllUsers = async () => {
    let users: UserModel[] = await this.user.getAllUsers(this.userQueryReturningStatement);

    return users;
  };

  deleteUser = async (userToDeleteGuid: string) => {
    await this.user.deleteUser(userToDeleteGuid);
  };

  updateUser = async (userToUpdateGuid: string, payload: UserPatchRequestPayload) => {
    try {
      const {
        personal_data: personalDataPayload,
        address: addressPayload,
        ...userPayload
      } = payload;
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
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'user_guid' of undefined":
        default:
          throw new HttpException(`User not found`, 704, 404);
      }
    }
  };
}

export { UserService };
