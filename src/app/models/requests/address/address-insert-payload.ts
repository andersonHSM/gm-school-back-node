import { AddressModel } from '@models/entities';

export type AddressInsertPayload = Omit<AddressModel, 'address_guid'>;
