import { ClassStage } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { ClassStageInsertPayload } from '@models/requests/class-stage';
import Joi from 'joi';

export class ClassStageService {
  constructor(private readonly classStage: ClassStage) {}

  private readonly returningFields = ['class_stage.class_stage_guid', 'class_stage.description'];

  getAllActiveClassStages = async () => {
    try {
      return await this.classStage.getAllActiveClassStages(this.returningFields);
    } catch (error) {
      switch (error.message) {
        default:
          throw new HttpException(error.message, 999, 500);
      }
    }
  };

  insertClassStage = async (payload: ClassStageInsertPayload) => {
    const schema = Joi.object({
      description: Joi.string().max(25).required(),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw new HttpException('Verify the fields', 712, 400);
    }

    const classStage = await this.classStage.insertClassStage(this.returningFields, payload);

    if (!classStage) {
      throw new HttpException('Class stage already exists', 625, 409);
    }

    return classStage;
  };
}
