import { Address } from '@database/accessors';
import { unkownException } from '@exceptions/index';
import { addressNotFoundException } from '@exceptions/address-exceptions';
import { HttpException } from '@exceptions/http-exception';
import { verifyTheFieldsException } from '@exceptions/schema';
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

  getAddress = async (address_guid: string) => {
    try {
      return await this.address.getAddress(address_guid, this.addressQueryReturning);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'address_guid' of undefined":
        default:
          throw addressNotFoundException();
      }
    }
  };

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
        throw verifyTheFieldsException();
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
        throw verifyTheFieldsException();
      }
    }

    try {
      return await this.address.updateAddress(address_guid, this.addressQueryReturning, payload);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'address_guid' of undefined":
        default:
          throw addressNotFoundException();
      }
    }
  };

  deleteAddress = async (address_guid: string) => {
    try {
      await this.address.deleteAddress(address_guid);
    } catch (error) {
      switch (error.message) {
        default:
          throw unkownException(error.message);
      }
    }
  };
}

export { AddressService };
