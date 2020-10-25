import { Class } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { ClassInsertPayload } from '@models/requests/class';
import Joi from 'joi';

export class ClassService {
  constructor(private readonly classEntity: Class) {}

  private readonly returningFields = [
    'class_guid',
    'description',
    'class_year',
    'class_division',
    'class_stage_guid',
  ];

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
}
