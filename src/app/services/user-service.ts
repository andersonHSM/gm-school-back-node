import { Address, PersonalData, Role, User } from '@database/accessors';
import { addressNotFoundException } from '@exceptions/address-exceptions';
import { HttpException } from '@exceptions/index';
import {
  userMustHaveValidAddressToUpdate,
  userNotFoundException,
} from '@exceptions/user-exceptions/';
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
    'user.registration',
  ];

  getUser = async (user_guid: string) => {
    try {
      return await this.user.getUserByGuid(user_guid, this.userQueryReturningStatement);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'user_guid' of undefined":
        default:
          throw userNotFoundException();
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
        throw userMustHaveValidAddressToUpdate();
      }

      address =
        address_guid && addressPayload
          ? await this.address.updateAddress(
              address_guid,
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
        case "Cannot read property 'address_guid' of undefined":
          throw addressNotFoundException();
        case "Cannot read property 'user_guid' of undefined":
        default:
          throw userNotFoundException();
      }
    }
  };

  getUsersByRole = async (roles: string[]) => {
    return await this.user.getUsersByRole(roles, this.userQueryReturningStatement);
  };
}

export { UserService };
