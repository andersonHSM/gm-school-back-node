export interface AddressModel {
  address_guid: string | ArrayLike<number>;
  street: string;
  number: string;
  district: string;
  zip_code: string;
  complement?: string;
  city: string;
  state: string;
  country: string;
}
