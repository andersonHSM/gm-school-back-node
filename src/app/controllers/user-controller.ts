import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { AuthenticatedRequest } from '@models/requests/auth';
import { UserService } from '@services/index';
import { Response } from 'express';

class UserController implements BaseController {
  constructor(private userService: UserService) {}
  index(req: AuthenticatedRequest, res: Response) {
    const { user_guid } = req;

    try {
      this.userService.getAllUsersFromDataBase(user_guid);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }
    }
  }
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

export { UserController };
