import { Discipline } from '@database/accessors';
import {
  disciplineAlreadyExistsException,
  disciplineNotFoundException,
} from '@exceptions/discipline-exceptions';
import { HttpException, unkownException } from '@exceptions/index';
import { verifyTheFieldsException } from '@exceptions/schema';
import { DisciplineInsertPayload, DisciplineUpdatePayload } from '@models/requests/discipline';
import Joi from 'joi';

export class DisciplineService {
  constructor(private readonly discipline: Discipline) {}

  private readonly returningFields = ['discipline.description', 'discipline.discipline_guid'];

  getAllActiveDisciplines = async () => {
    try {
      return await this.discipline.getAllActiveDisciplines(this.returningFields);
    } catch (error) {
      switch (error.message) {
        default:
          throw unkownException(error.message);
      }
    }
  };

  getActiveDiscipline = async (discipline_guid: string) => {
    try {
      return await this.discipline.getActiveDiscipline(discipline_guid, this.returningFields);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'description' of undefined":
          throw disciplineNotFoundException();

        default:
          throw unkownException(error.message);
      }
    }
  };

  insertDiscipline = async (payload: DisciplineInsertPayload) => {
    const schema = Joi.object({
      description: Joi.string().max(45).required(),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw verifyTheFieldsException();
    }

    const existingDiscipline = await this.discipline.verifyExistingDiscipline(
      undefined,
      payload.description
    );

    if (existingDiscipline) {
      throw disciplineAlreadyExistsException();
    }

    try {
      return await this.discipline.insertDiscipline(this.returningFields, payload);
    } catch (error) {
      switch (error.message) {
        default:
          throw unkownException(error.message);
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
      throw verifyTheFieldsException();
    }

    try {
      return await this.discipline.updateDiscipline(discipline_guid, this.returningFields, payload);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'description' of undefined":
          throw disciplineNotFoundException();

        default:
          throw unkownException(error.message);
      }
    }
  };

  deleteDiscipline = async (discipline_guid: string) => {
    try {
      return await this.discipline.deleteDiscipline(discipline_guid);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'description' of undefined":
        case "Cannot read property 'discipline_guid' of undefined":
          throw disciplineNotFoundException();

        default:
          throw unkownException(error.message);
      }
    }
  };
}
