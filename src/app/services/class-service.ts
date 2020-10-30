import { Class, Discipline } from '@database/accessors';
import { HttpException } from '@exceptions/index';
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
          throw new HttpException(`Class not found`, 602, 404);
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
      throw new HttpException('Invalid class payload', 501, 400);
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
      throw new HttpException('Invalid class payload', 501, 400);
    }

    try {
      return await this.classEntity.updateClass(class_guid, this.returningFields, payload);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'class_guid' of undefined":
        default:
          throw new HttpException(`Class not found`, 602, 404);
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
          throw new HttpException(`Class not found`, 602, 404);
      }
    }
  };

  setDisciplinesToClass = async (
    class_guid: string,
    payload: SetDisciplinesToClassRequestPayload
  ) => {
    const existingClass = await this.classEntity.verifyExistingClass(class_guid);

    if (!existingClass) {
      throw new HttpException('Class not found', 602, 404);
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
          throw new HttpException(error.message, 999, 500);
      }
    }
  };

  unsetDisciplineToClass = async (class_guid: string, discipline_guid: string) => {
    const [existingClass, existingDiscipline] = await Promise.all([
      this.classEntity.verifyExistingClass(class_guid),
      this.discipline.verifyExistingDiscipline(discipline_guid),
    ]);

    if (!existingClass) {
      throw new HttpException(`Class not found`, 602, 404);
    } else if (!existingDiscipline) {
      throw new HttpException('Discipline not found', 901, 404);
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
          throw new HttpException(error.message, 999, 500);
      }
    }
  };
}
