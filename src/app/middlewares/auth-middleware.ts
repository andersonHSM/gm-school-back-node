import {
  invalidTokenProvidedException,
  tokenMustBeProvidedException,
} from '@exceptions/auth-exceptions';
import { JwtService } from '@services/index';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions';

export class AuthMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  validate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      const exception = tokenMustBeProvidedException();

      return res.status(exception.statusCode).json(exception.format());
    }

    try {
      const validatedToken = this.jwtService.validateToken(token);
      (req as any).user_guid = (validatedToken as any).user_guid;
      return next();
    } catch (error) {
      const exception = invalidTokenProvidedException();

      return res.status(exception.statusCode).json(exception.format());
    }
  };
}
