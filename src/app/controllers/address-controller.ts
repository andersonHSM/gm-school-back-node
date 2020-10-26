import { HttpException } from '@exceptions/index';
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

      return res.status(201).json(address);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error);
    }
  };

  delete = async (req: Request<{ address_guid: string }> & AuthenticatedRequest, res: Response) => {
    const { address_guid } = req.params;
    try {
      await this.addressService.deleteAddress(address_guid);

      return res.status(200).json();
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json('Unkown error');
    }
  };

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

      return res.status(500).json(error.message);
    }
  };

  show = async (req: Request<{ address_guid: string }> & AuthenticatedRequest, res: Response) => {
    const { address_guid } = req.params;

    try {
      const address = await this.addressService.getAddress(address_guid);

      return res.status(200).json(address);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };
}

export { AddressController };
