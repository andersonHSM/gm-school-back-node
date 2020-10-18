import { Request, Response } from 'express';

import { BaseController } from '@models/index';
import { AuthService } from '@services/index';
import { SignUpRequest } from '@models/requests/auth';
import { HttpException } from '../exception';

export class AuthController implements BaseController {
  constructor(private authService: AuthService) {}

  store = async (req: Request<null, null, SignUpRequest>, res: Response) => {
    const { email, password, first_name, middle_names, last_name, personal_data } = req.body;
    const signUpRequest = { email, password, first_name, middle_names, last_name, personal_data };

    try {
      const insertUserReturn = await this.authService.signUp(signUpRequest);

      return res.status(200).json(insertUserReturn);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      console.log(error);

      return res.status(500).json({ error });
    }
  };

  delete() {
    throw new Error('Method not implemented.');
  }

  update() {
    throw new Error('Method not implemented.');
  }

  show = (_req: Request, res: Response): void => {
    res.status(200).send('OK');
  };

  index() {
    throw new Error('Method not implemented.');
  }
}
