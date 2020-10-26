import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { DisciplineInsertPayload, DisciplineUpdatePayload } from '@models/requests/discipline';
import { DisciplineService } from '@services/discipline-service';
import { Request, Response } from 'express';

export class DisciplineController implements BaseController {
  constructor(private readonly disciplineService: DisciplineService) {}
  index = async (_req: Request, res: Response) => {
    try {
      const disciplines = await this.disciplineService.getAllActiveDisciplines();

      return res.status(200).json(disciplines);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };

  store = async (req: Request<null, null, DisciplineInsertPayload>, res: Response) => {
    const { body: payload } = req;

    try {
      const discipline = await this.disciplineService.insertDiscipline(payload);

      return res.status(201).json(discipline);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };

  delete = async (req: Request<{ discipline_guid: string }>, res: Response) => {
    const { discipline_guid } = req.params;
    try {
      await this.disciplineService.deleteDiscipline(discipline_guid);

      return res.status(200).json();
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };

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

  show = async (req: Request<{ discipline_guid: string }>, res: Response) => {
    const { discipline_guid } = req.params;

    try {
      const discipline = await this.disciplineService.getActiveDiscipline(discipline_guid);

      return res.status(200).json(discipline);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error.message);
    }
  };
}
