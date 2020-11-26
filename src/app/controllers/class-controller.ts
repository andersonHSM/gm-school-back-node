import { classNotFoundException } from '@exceptions/class-exceptions';
import { HttpException } from '@exceptions/index';
import { BaseController } from '@models/index';
import { AuthenticatedRequest } from '@models/requests/auth';
import {
  ClassInsertPayload,
  ClassUpdatePayload,
  SetDisciplinesToClassRequestPayload,
  SetScheduleToClassByDisciplinePayload,
} from '@models/requests/class';
import { ClassService } from '@services/index';
import { Request, Response } from 'express';

export class ClassController implements BaseController {
  constructor(private readonly classService: ClassService) {}
  index = async (_req: Request & AuthenticatedRequest, res: Response) => {
    try {
      const classes = await this.classService.getAllClasses();

      return res.status(200).json(classes);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json({ error: error.message });
    }
  };

  store = async (req: Request<null, null, ClassInsertPayload>, res: Response) => {
    const payload = req.body;

    try {
      const classReturn = await this.classService.insertClass(payload);

      return res.status(201).json(classReturn);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json({ error: error.message });
    }
  };

  delete = async (req: Request<{ class_guid: string }>, res: Response) => {
    const { class_guid } = req.params;
    try {
      const classReturn = await this.classService.deleteClass(class_guid);

      if (!classReturn) {
        throw classNotFoundException();
      }

      return res.status(200).json();
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json({ error: error.message });
    }
  };

  update = async (
    req: Request<{ class_guid: string }, null, ClassUpdatePayload>,
    res: Response
  ) => {
    const { class_guid } = req.params;
    const payload = req.body;

    try {
      const classReturn = await this.classService.updateClass(class_guid, payload);

      return res.status(200).json(classReturn);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json({ error: error.message });
    }
  };

  show = async (req: Request<{ class_guid: string }>, res: Response) => {
    const { class_guid } = req.params;
    try {
      const classReturn = await this.classService.getClass(class_guid);

      return res.status(200).json(classReturn);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json({ error: error.message });
    }
  };

  setDisciplinesToClass = async (
    req: Request<{ class_guid: string }, null, SetDisciplinesToClassRequestPayload>,
    res: Response
  ) => {
    const { class_guid } = req.params;
    const { body: payload } = req;

    try {
      const classReturn = await this.classService.setDisciplinesToClass(class_guid, payload);

      return res.status(200).json(classReturn);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json({ error: error.message });
    }
  };

  unsetDisciplineToClass = async (
    req: Request<{ class_guid: string; discipline_guid: string }>,
    res: Response
  ) => {
    const { class_guid, discipline_guid } = req.params;

    try {
      const unsetReturn = await this.classService.unsetDisciplineToClass(
        class_guid,
        discipline_guid
      );

      return res.status(200).json(unsetReturn);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json({ error: error.message });
    }
  };

  getActiveClassWithDisciplines = async (req: Request<{ class_guid: string }>, res: Response) => {
    const { class_guid } = req.params;
    try {
      const classWithDisciplines = await this.classService.getActiveClassWithDisciplines(
        class_guid
      );

      return res.status(200).json(classWithDisciplines);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json({ error: error.message });
    }
  };

  setScheduleToClassByDiscipline = async (
    req: Request<{ class_guid: string }, null, SetScheduleToClassByDisciplinePayload>,
    res: Response
  ) => {
    const { body: payload } = req;

    try {
      const returning = await this.classService.setScheduleToClassByDiscipline(payload);

      return res.status(201).json(returning);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json({ error: error.message });
    }
  };
}
