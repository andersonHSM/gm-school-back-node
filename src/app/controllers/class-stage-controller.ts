import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { ClassStageInsertPayload } from '@models/requests/class-stage';
import { ClassStageService } from '@services/index';
import { Request, Response } from 'express';

export class ClassStageController implements BaseController {
  constructor(private readonly classStageService: ClassStageService) {}

  index() {
    throw new Error('Method not implemented.');
  }
  store = async (req: Request<null, null, ClassStageInsertPayload>, res: Response) => {
    const { body: payload } = req;

    try {
      const classStage = await this.classStageService.insertClassStage(payload);

      return res.status(201).json(classStage);
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
