import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { ScheduleInsertPayload, ScheduleUpdatePayload } from '@models/requests/schedule';
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

  update = async (
    req: Request<{ schedule_guid: string }, null, ScheduleUpdatePayload>,
    res: Response
  ) => {
    const { schedule_guid } = req.params;
    const { body: payload } = req;

    try {
      const schedule = await this.scheduleService.updateSchedule(schedule_guid, payload);
      return res.status(200).json(schedule);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };

  show = async (req: Request<{ schedule_guid: string }>, res: Response) => {
    const { schedule_guid } = req.params;

    try {
      const schedule = await this.scheduleService.retrieveSchedule(schedule_guid);
      return res.status(200).json(schedule);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };
}
