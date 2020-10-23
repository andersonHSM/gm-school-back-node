import { AddressModel } from '@models/entities';

export type AddressUpdatePayload = Partial<Omit<AddressModel, 'address_guid'>>;
