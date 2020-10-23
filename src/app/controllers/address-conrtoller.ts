import { Address } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { AddressModel } from '@models/entities';
import { BaseController } from '@models/index';
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
    req: Request<null, null, Omit<AddressModel, 'address_guid'>> & AuthenticatedRequest,
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
    }
  };
  delete() {
    throw new Error('Method not implemented.');
  }
  update() {
    throw new Error('Method not implemented.');
  }
  show() {
    throw new Error('Method not implemented.');
  }
}

export { AddressController };
