import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { ClassInsertPayload } from '@models/requests/class';
import { ClassService } from '@services/index';
import { Request, Response } from 'express';

export class ClassController implements BaseController {
  constructor(private readonly classService: ClassService) {}
  index() {
    throw new Error('Method not implemented.');
  }

  store = async (req: Request<null, null, ClassInsertPayload>, res: Response) => {
    const payload = req.body;

    try {
      const classReturn = await this.classService.insertClass(payload);

      return res.status(200).json(classReturn);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json({ error: error.message });
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
