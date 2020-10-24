import { JwtService } from '@services/index';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions';

export class AuthMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  validate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      const exception = new HttpException('A token must me provided', 705, 422);

      return res.status(exception.statusCode).json(exception.format());
    }

    try {
      const validatedToken = this.jwtService.validateToken(token);
      (req as any).user_guid = (validatedToken as any).user_guid;
      return next();
    } catch (error) {
      const exception = new HttpException('Invalid token provided', 706, 400);

      return res.status(exception.statusCode).json(exception.format());
    }
  };
}
