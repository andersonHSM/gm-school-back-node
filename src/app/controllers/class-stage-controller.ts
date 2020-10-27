import { ClassStage } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { Request, Response } from 'express';

export class ClassStageController implements BaseController {
  constructor(private readonly classStage: ClassStage) {}

  index() {
    throw new Error('Method not implemented.');
  }
  store = (req: Request, res: Response) => {
    try {
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };
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
