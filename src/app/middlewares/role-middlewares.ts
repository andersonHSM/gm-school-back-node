import { Role, User } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { userNotFoundException } from '@exceptions/user-exceptions/';
import { RoleModel } from '@models/entities';
import { RolesEnum } from '@models/enums';
import { AuthenticatedRequest } from '@models/requests/auth';
import { NextFunction, Request, Response } from 'express';

export class RoleMiddlewares {
  constructor(private readonly role: Role) {}

  isAdmin = async (req: Request & AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { user_guid: authenticatedUserGuid } = req;

    try {
      const role = await this.role.getRoleByUserGuid(authenticatedUserGuid);

      if (role?.description === 'administrator') {
        return next();
      }

      return res.status(403).json({ message: 'User must be a administrator' });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }
    }
  };

  isAdminOrSameUser = async (
    req: Request<{ user_guid: string }> & AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { user_guid: authenticatedUserGuid } = req;
    const { user_guid: paramUserGuid } = req.params;

    const rolesPromise = [
      this.role.getRoleByUserGuid(authenticatedUserGuid),
      this.role.getRoleByUserGuid(paramUserGuid),
    ];

    const [authenticatedUserRole, paramUserRole] = await Promise.all(rolesPromise);

    if (!authenticatedUserRole || !paramUserRole) {
      const exception = userNotFoundException();

      return res.status(exception.statusCode).json(exception.format());
    }

    if (
      authenticatedUserGuid !== paramUserGuid &&
      authenticatedUserRole.description !== RolesEnum.administrator
    ) {
      const exception = new HttpException('Insufficient permission', 707, 403);

      return res.status(exception.statusCode).json(exception.format());
    }

    if (
      paramUserRole.description === RolesEnum.administrator &&
      authenticatedUserRole.description === RolesEnum.administrator &&
      authenticatedUserGuid !== paramUserGuid
    ) {
      const exception = new HttpException(
        'An administrator can not change or delete an equivalent account',
        708,
        403
      );

      return res.status(exception.statusCode).json(exception.format());
    }
    return next();
  };

  isAdminOrProfessorOrCoordinator = async (
    req: Request & AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { user_guid } = req;

    try {
      const role = await this.role.getRoleByUserGuid(user_guid);

      if (role?.description !== RolesEnum.student) {
        return next();
      }

      return res.status(403).json({ message: 'User must not me a student.' });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }
    }
  };
}
