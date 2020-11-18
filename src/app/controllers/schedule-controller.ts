import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { ScheduleInsertPayload } from '@models/requests/schedule';
import { ScheduleService } from '@services/index';
import { Request, Response } from 'express';

export class ScheduleController implements BaseController {
  constructor(private readonly scheduleService: ScheduleService) {}
  index = async (req: Request, res: Response) => {
    try {
      return res.status(200).json(await this.scheduleService.getAllActiveSchedules());
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };
  store = async (req: Request<null, null, ScheduleInsertPayload>, res: Response) => {
    const { body: payload } = req;

    try {
      return res.status(201).json(await this.scheduleService.insertSchedule(payload));
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };
  delete = async (req: Request<{ schedule_guid: string }>, res: Response) => {
    const { schedule_guid } = req.params;

    try {
      await this.scheduleService.deleteSchedule(schedule_guid);
      return res.status(200).json();
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };
  update(...args: any[]) {
    throw new Error('Method not implemented.');
  }
  show(...args: any[]) {
    throw new Error('Method not implemented.');
  }
}
