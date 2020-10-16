import { Request, Response } from 'express';

import { BaseController } from '@models/index';
import { AuthService } from '@services/index';
import { SignUpRequest } from '@models/requests/auth';

export class AuthController implements BaseController {
  constructor(private authService: AuthService) {}

  store = async (req: Request<null, null, SignUpRequest>, res: Response) => {
    const { email, password, firstName, middleNames, lastName } = req.body;
    console.log('store');
    const signUpRequest = { email, password, firstName, middleNames, lastName };

    try {
      await this.authService.signUp(signUpRequest);
    } catch (error) {
      console.log(error);
    }

    return res.status(200).send('OK');
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
