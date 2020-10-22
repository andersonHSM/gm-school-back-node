export interface AddressModel {
  address_guid: string | Uint8Array;
  street: string;
  number: string;
  district: string;
  zip_code: string;
  complement?: string;
  city: string;
  state: string;
  country: string;
}
