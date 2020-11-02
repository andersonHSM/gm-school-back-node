import { ClassStage } from '@database/accessors';
import { HttpException } from '@exceptions/index';
import { ClassStageInsertPayload, ClassStageUpdatePayload } from '@models/requests/class-stage';
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

  getActiveClassStageByGuid = async (class_stage_guid: string) => {
    try {
      return await this.classStage.getActiveClassStageByGuid(
        class_stage_guid,
        this.returningFields
      );
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'description' of undefined":
          throw new HttpException('Class stage not found', 901, 404);
        default:
          throw new HttpException(error.message, 999, 500);
      }
    }
  };

  updateClassStage = async (class_stage_guid: string, payload: ClassStageUpdatePayload) => {
    const schema = Joi.object({
      description: Joi.string().max(25).required(),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw new HttpException('Verify the fields', 712, 400);
    }

    const existingClassStage = await this.classStage.verifyExistingClassStage(payload.description);

    if (existingClassStage) {
      throw new HttpException('Class stage already exists', 625, 409);
    }

    try {
      return await this.classStage.updateClassStage(
        class_stage_guid,
        this.returningFields,
        payload
      );
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'description' of undefined":
          throw new HttpException('Class stage not found', 901, 404);
        default:
          throw new HttpException(error.message, 999, 500);
      }
    }
  };

  deleteClassStage = async (class_stage_guid: string) => {
    const deletedClassStage = await this.classStage.deleteClassStage(
      class_stage_guid,
      this.returningFields
    );

    if (!deletedClassStage) {
      throw new HttpException('Class stage not found', 901, 404);
    }

    return deletedClassStage;
  };
}
