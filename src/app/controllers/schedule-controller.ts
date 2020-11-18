import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { ScheduleInsertPayload } from '@models/requests/schedule';
import { ScheduleService } from '@services/index';
import { Request, Response } from 'express';

export class ScheduleController implements BaseController {
  constructor(private readonly scheduleService: ScheduleService) {}
  index(...args: any[]) {
    throw new Error('Method not implemented.');
  }
  store = async (req: Request<null, null, ScheduleInsertPayload>, res: Response) => {
    const { body: payload } = req;

    try {
      return res.status(200).json(await this.scheduleService.insertSchedule(payload));
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      console.log(error);

      return res.status(500).json(error.message);
    }
  };
  delete(...args: any[]) {
    throw new Error('Method not implemented.');
  }
  update(...args: any[]) {
    throw new Error('Method not implemented.');
  }
  show(...args: any[]) {
    throw new Error('Method not implemented.');
  }
}
