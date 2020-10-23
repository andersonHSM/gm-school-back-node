import { Address } from '@database/accessors';
import { HttpException } from '@exceptions/http-exception';
import { AddressModel } from '@models/entities';
import { AddressUpdatePayload } from '@models/requests/address';
import Joi from 'joi';

class AddressService {
  constructor(private readonly address: Address) {}

  private addressQueryReturning = [
    'street',
    'number',
    'district',
    'zip_code',
    'complement',
    'city',
    'state',
    'country',
  ];

  getAllAddresses = async (): Promise<AddressModel[]> => {
    return await this.address.getAllActiveAddresses(this.addressQueryReturning);
  };

  insertNewAddress = async (payload: Omit<AddressModel, 'address_guid'>) => {
    const schema = Joi.object({
      street: Joi.string().required().max(65),
      number: Joi.string().required(),
      district: Joi.string().required().max(45),
      zip_code: Joi.string().required().length(8),
      complement: Joi.string().max(25).allow(null, ''),
      city: Joi.string().required().max(45),
      state: Joi.string().required().max(45),
      country: Joi.string().required().max(45),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        throw new HttpException('Verify the fields', 712, 400);
      }
    }

    return await this.address.insertAddress(this.addressQueryReturning, payload);
  };

  updateExistingAddress = async (address_guid: string, payload: AddressUpdatePayload) => {
    const schema = Joi.object({
      street: Joi.string().max(65),
      number: Joi.string(),
      district: Joi.string().max(45),
      zip_code: Joi.string().length(8),
      complement: Joi.string().max(25).allow(null, ''),
      city: Joi.string().max(45),
      state: Joi.string().max(45),
      country: Joi.string().max(45),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        throw new HttpException('Verify the fields', 712, 400);
      }
    }

    return await this.address.updateAddress(address_guid, this.addressQueryReturning, payload);
  };
}

export { AddressService };

/* 
"street": "Travessa Santa Isabel",
    "number": "667",
    "district": "Centro",
    "zip_code": "49900000",
    "complement": "",
    "city": "Propriá",
    "state": "SE",
    "country": "Brasil", */
