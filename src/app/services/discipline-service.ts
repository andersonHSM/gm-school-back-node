import { Discipline } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { DisciplineInsertPayload, DisciplineUpdatePayload } from '@models/requests/discipline';
import Joi from 'joi';

export class DisciplineService {
  constructor(private readonly discipline: Discipline) {}

  private readonly returningFields = ['discipline.description', 'discipline.discipline_guid'];

  insertDiscipline = async (payload: DisciplineInsertPayload) => {
    const schema = Joi.object({
      description: Joi.string().max(45).required(),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw new HttpException('Verify the fields', 712, 400);
    }

    try {
      return await this.discipline.insertDiscipline(this.returningFields, payload);
    } catch (error) {
      switch (error.message) {
        default:
          throw new HttpException(error.message, 999, 500);
      }
    }
  };

  updateDiscipline = async (discipline_guid: string, payload: DisciplineUpdatePayload) => {
    const schema = Joi.object({
      description: Joi.string().max(45).required(),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw new HttpException('Verify the fields', 712, 400);
    }

    try {
      return await this.discipline.updateDiscipline(discipline_guid, this.returningFields, payload);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'description' of undefined":
          throw new HttpException('Discipline not found', 901, 404);
        default:
          throw new HttpException(error.message, 999, 500);
      }
    }
  };
}
