import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { AuthenticatedRequest } from '@models/requests/auth';
import { AddressService } from '@services/index';
import { Request, Response } from 'express';

class AddressController implements BaseController {
  constructor(private readonly addressService: AddressService) {}

  index = async (_req: Request & AuthenticatedRequest, res: Response) => {
    try {
      await this.addressService;
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }
    }
    throw new Error('Method not implemented.');
  };
  store() {
    throw new Error('Method not implemented.');
  }
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
