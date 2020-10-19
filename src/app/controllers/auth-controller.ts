import { Request, Response } from 'express';

import { BaseController } from '@models/index';
import { AuthService } from '@services/index';
import { LoginRequest, SignUpRequest } from '@models/requests/auth';
import { HttpException } from '@exceptions/index';

export class AuthController implements BaseController {
  constructor(private authService: AuthService) {}

  store = async (req: Request<null, null, SignUpRequest>, res: Response) => {
    const { email, password, first_name, middle_names, last_name, personal_data, role } = req.body;
    const signUpRequest = {
      email,
      password,
      first_name,
      middle_names,
      last_name,
      personal_data,
      role,
    };

    try {
      const insertUserReturn = await this.authService.signUp(signUpRequest);

      return res.status(200).json(insertUserReturn);
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

  update() {
    throw new Error('Method not implemented.');
  }

  show = async (req: Request<null, null, LoginRequest>, res: Response) => {
    try {
      const payload = await this.authService.signIn(req.body);

      return res.status(200).json(payload);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }
    }
  };

  index() {
    throw new Error('Method not implemented.');
  }
}
