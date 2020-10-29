import { Class } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { ClassInsertPayload, ClassUpdatePayload } from '@models/requests/class';
import Joi from 'joi';

export class ClassService {
  constructor(private readonly classEntity: Class) {}

  private readonly returningFields = [
    'class.class_guid',
    'class.description',
    'class.class_year',
    'class.class_division',
    'class.class_stage_guid',
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
      console.log(error);
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
}
