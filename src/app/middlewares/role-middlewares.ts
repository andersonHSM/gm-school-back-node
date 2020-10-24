import { Role, User } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { AuthenticatedRequest } from '@models/requests/auth';
import { NextFunction, Request, Response } from 'express';

export class RoleMiddlewares {
  constructor(private readonly role: Role) {}

  isAdmin = async (req: Request & AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { user_guid: authenticatedUserGuid } = req;

    try {
      const role = await this.role.getRoleByUserGuid(authenticatedUserGuid);

      if (role.description === 'administrator') {
        return next();
      }

      return res.status(403).json({ message: 'User must be a administrator' });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }
    }
  };
}
