import { AddressModel } from '@models/entities';
import { UserPatchRequestPayload } from '@models/requests/user';
import Knex from 'knex';
import { stringify as uuidStringify } from 'uuid';

class Address {
  constructor(private readonly knex: Knex) {}

  updateAddress = async (
    address_guid: ArrayLike<number>,
    payload: Pick<UserPatchRequestPayload, 'address'>
  ): Promise<AddressModel> => {
    const [{ address_guid: entityAddressGuid, ...address }]: AddressModel[] = await this.knex(
      'address'
    )
      .where({ address_guid })
      .update(payload);

    return { ...address, address_guid: uuidStringify(entityAddressGuid as Uint8Array) };
  };
}

export { Address };
