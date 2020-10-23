import { AddressModel } from '@models/entities';
import Knex from 'knex';
import { stringify as uuidStringify, parse as uuidParse, v4 as uuidv4 } from 'uuid';

class Address {
  constructor(private readonly knex: Knex) {}

  getAllActiveAddresses = async (returningFields: string[]) => {
    let addresses: AddressModel[] = await this.knex('address')
      .select([...returningFields, 'address_guid'])
      .whereNull('deleted_at');

    addresses = addresses.map(address => {
      const { address_guid, ...remaininAddress } = address;

      return { ...remaininAddress, address_guid: uuidStringify(address_guid as ArrayLike<number>) };
    });

    return addresses;
  };

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
      .returning([...returningFields, 'address_guid']);

    return { address_guid, ...address };
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
