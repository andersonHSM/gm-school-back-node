import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { AuthenticatedRequest } from '@models/requests/auth';
import { UserPatchRequestPayload } from '@models/requests/user';
import { UserService } from '@services/index';
import { Response, Request } from 'express';

class UserController implements BaseController {
  constructor(private userService: UserService) {}

  index = async (req: Request & AuthenticatedRequest, res: Response) => {
    const { user_guid } = req;

    try {
      const users = await this.userService.getAllUsers(user_guid);

      return res.status(200).json(users);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json('Unkown error');
    }
  };

  store() {
    throw new Error('Method not implemented.');
  }

  delete = async (req: Request<{ user_guid: string }> & AuthenticatedRequest, res: Response) => {
    try {
      const { user_guid: requestUserGuid } = req;
      const { user_guid: paramsUserGuid } = req.params;

      await this.userService.deleteUser(requestUserGuid, paramsUserGuid);

      return res.status(200).json();
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }
      console.log({ error });
      return res.status(500).json('Unkown error');
    }
  };

  update = async (
    req: Request<{ user_guid: string }, null, UserPatchRequestPayload> & AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const { user_guid: requestUserGuid } = req;
      const { user_guid: paramsUserGuid } = req.params;

      const returnObject = await this.userService.updateUser(
        requestUserGuid,
        paramsUserGuid,
        req.body
      );

      return res.status(200).json(returnObject);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }
      console.log({ error });
      return res.status(500).json('Unkown error');
    }
  };

  show() {
    throw new Error('Method not implemented.');
  }
}

export { UserController };
