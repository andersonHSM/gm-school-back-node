import { Address } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { AddressModel } from '@models/entities';
import { BaseController } from '@models/index';
import { AddressInsertPayload, AddressUpdatePayload } from '@models/requests/address';
import { AuthenticatedRequest } from '@models/requests/auth';
import { AddressService } from '@services/index';
import { Request, Response } from 'express';

class AddressController implements BaseController {
  constructor(private readonly addressService: AddressService) {}

  index = async (_req: Request & AuthenticatedRequest, res: Response) => {
    try {
      return res.status(200).json(await this.addressService.getAllAddresses());
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }
    }
  };

  store = async (
    req: Request<null, null, AddressInsertPayload> & AuthenticatedRequest,
    res: Response
  ) => {
    const addressPayload = req.body;

    try {
      const address = await this.addressService.insertNewAddress(addressPayload);

      return res.status(200).json(address);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error);
    }
  };

  delete() {
    throw new Error('Method not implemented.');
  }

  update = async (
    req: Request<{ address_guid: string }, null, AddressUpdatePayload> & AuthenticatedRequest,
    res: Response
  ) => {
    const addressPayload = req.body;
    const { address_guid } = req.params;

    try {
      const address = await this.addressService.updateExistingAddress(address_guid, addressPayload);

      return res.status(200).json(address);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error);
    }
  };

  show() {
    throw new Error('Method not implemented.');
  }
}

export { AddressController };
