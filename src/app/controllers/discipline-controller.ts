import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { DisciplineInsertPayload, DisciplineUpdatePayload } from '@models/requests/discipline';
import { DisciplineService } from '@services/discipline-service';
import { Request, Response } from 'express';

export class DisciplineController implements BaseController {
  constructor(private readonly disciplineService: DisciplineService) {}
  index(_req: Request, res: Response) {
    try {
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  }
  store = async (req: Request<null, null, DisciplineInsertPayload>, res: Response) => {
    const { body: payload } = req;

    try {
      const discipline = await this.disciplineService.insertDiscipline(payload);

      return res.status(200).json(discipline);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };
  delete(_req: Request, res: Response) {
    try {
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  }
  update = async (
    req: Request<{ discipline_guid: string }, null, DisciplineUpdatePayload>,
    res: Response
  ) => {
    const { body: payload, params } = req;
    const { discipline_guid } = params;

    try {
      const discipline = await this.disciplineService.updateDiscipline(discipline_guid, payload);

      return res.status(200).json(discipline);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };
  show(_req: Request, res: Response) {
    try {
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  }
}
