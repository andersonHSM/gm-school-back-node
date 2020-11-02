import { Class, Discipline } from '@database/accessors';
import { classNotFoundException, invalidClassPayloadException } from '@exceptions/class-exceptions';
import { disciplineNotFoundException } from '@exceptions/discipline-exceptions';
import { HttpException, unkownException } from '@exceptions/index';
import {
  ClassInsertPayload,
  ClassUpdatePayload,
  SetDisciplinesToClassRequestPayload,
} from '@models/requests/class';
import Joi from 'joi';

export class ClassService {
  constructor(private readonly classEntity: Class, private readonly discipline: Discipline) {}

  private readonly returningFields = [
    'class.class_guid',
    'class.description',
    'class.class_year',
    'class.class_division',
    'class.class_stage_guid',
  ];

  private readonly classHasDisciplineReturningFields = [
    'class_has_discipline.class_has_discipline_guid',
    'class_has_discipline.class_guid',
    'class_has_discipline.discipline_guid',
  ];

  getClass = async (class_guid: string) => {
    try {
      return await this.classEntity.getClass(class_guid, this.returningFields);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'class_guid' of undefined":
        default:
          throw classNotFoundException();
      }
    }
  };

  getAllClasses = async () => {
    return await this.classEntity.getAllClasses(this.returningFields);
  };

  insertClass = async (payload: ClassInsertPayload) => {
    const schema = Joi.object({
      description: Joi.string().required().max(45),
      class_year: Joi.string().required().max(2),
      class_division: Joi.string().required().max(1),
      class_stage_guid: Joi.string().required(),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw invalidClassPayloadException();
    }

    return await this.classEntity.insertClass(payload, this.returningFields);
  };

  updateClass = async (class_guid: string, payload: ClassUpdatePayload) => {
    const schema = Joi.object({
      description: Joi.string().max(45),
      class_year: Joi.string().max(2),
      class_division: Joi.string().max(1),
      class_stage_guid: Joi.string().required(),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw invalidClassPayloadException();
    }

    try {
      return await this.classEntity.updateClass(class_guid, this.returningFields, payload);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'class_guid' of undefined":
        default:
          throw classNotFoundException();
      }
    }
  };

  deleteClass = async (class_guid: string) => {
    try {
      return await this.classEntity.deleteClass(class_guid);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'class_guid' of undefined":
        default:
          throw classNotFoundException();
      }
    }
  };

  setDisciplinesToClass = async (
    class_guid: string,
    payload: SetDisciplinesToClassRequestPayload
  ) => {
    const existingClass = await this.classEntity.verifyExistingClass(class_guid);

    if (!existingClass) {
      throw classNotFoundException();
    }

    let finalPayload: any[] = [];

    for (const { discipline_guid } of payload) {
      const [existingDiscipline, existingClassDiscipline] = await Promise.all([
        this.discipline.verifyExistingDiscipline(discipline_guid as string),
        this.classEntity.verifyExistingClassDiscipline(class_guid, discipline_guid as string),
      ]);

      if (!existingClassDiscipline && existingDiscipline) {
        finalPayload = finalPayload.concat({ discipline_guid });
      }
    }

    if (finalPayload.length === 0) {
      return [];
    }

    try {
      return await this.classEntity.setDisciplinesToClass(
        class_guid,
        this.classHasDisciplineReturningFields,
        finalPayload
      );
    } catch (error) {
      switch (error.message) {
        default:
          throw unkownException(error.message);
      }
    }
  };

  unsetDisciplineToClass = async (class_guid: string, discipline_guid: string) => {
    const [existingClass, existingDiscipline] = await Promise.all([
      this.classEntity.verifyExistingClass(class_guid),
      this.discipline.verifyExistingDiscipline(discipline_guid),
    ]);

    if (!existingClass) {
      throw classNotFoundException();
    } else if (!existingDiscipline) {
      throw disciplineNotFoundException();
    }

    try {
      return await this.classEntity.unsetDisciplineToClass(
        class_guid,
        discipline_guid,
        this.classHasDisciplineReturningFields
      );
    } catch (error) {
      switch (error.message) {
        default:
          throw unkownException(error.message);
      }
    }
  };

  getActiveClassWithDisciplines = async (class_guid: string) => {
    const existingClass = await this.classEntity.verifyExistingClass(class_guid);

    if (!existingClass) {
      throw classNotFoundException();
    }

    try {
      const classReturn = await this.classEntity.getClass(class_guid, this.returningFields);
      const disciplines = await this.discipline.getDisciplineByClassGuid(class_guid);

      return { ...classReturn, disciplines };
    } catch (error) {
      switch (error.message) {
        default:
          throw unkownException(error.message);
      }
    }
  };
}
