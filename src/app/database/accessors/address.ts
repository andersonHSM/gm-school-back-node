import { AddressModel } from '@models/entities';
import { UserPatchRequestPayload } from '@models/requests/user';
import Knex from 'knex';
import { stringify as uuidStringify, parse as uuidParse, v4 as uuidv4 } from 'uuid';

class Address {
  constructor(private readonly knex: Knex) {}

  insertAddress = async (
    returningFields: string[],
    payload: Omit<AddressModel, 'address_guid'>
  ): Promise<AddressModel> => {
    const address_guid = uuidv4();

    const [{ address_guid: queryGuid, ...address }]: AddressModel[] = await this.knex('address')
      .insert({
        ...payload,
        address_guid: uuidParse(address_guid),
      })
      .returning(returningFields);

    return { ...address, address_guid };
  };

  updateAddress = async (
    address_guid: ArrayLike<number>,
    returningFields: string[],
    payload: Omit<AddressModel, 'address_guid'>
  ): Promise<AddressModel> => {
    const [{ address_guid: entityAddressGuid, ...address }]: AddressModel[] = await this.knex(
      'address'
    )
      .where({ address_guid })
      .update(payload)
      .returning([...returningFields, 'address_guid']);

    return { ...address, address_guid: uuidStringify(entityAddressGuid as ArrayLike<number>) };
  };
}

export { Address };
