import { ClassStage } from '@database/accessors';
import { classStageNotFound } from '@exceptions/class-stage';
import { classStageAlreadyExistsException } from '@exceptions/class-stage/class-stage-already-exists';
import { HttpException, unkownException } from '@exceptions/index';
import { verifyTheFieldsException } from '@exceptions/schema';
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
          throw unkownException(error.message);
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
      throw verifyTheFieldsException();
    }

    const classStage = await this.classStage.insertClassStage(this.returningFields, payload);

    if (!classStage) {
      throw classStageAlreadyExistsException();
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
          throw classStageNotFound();
        default:
          throw unkownException(error.message);
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
      throw verifyTheFieldsException();
    }

    const existingClassStage = await this.classStage.verifyExistingClassStage(payload.description);

    if (existingClassStage) {
      throw classStageAlreadyExistsException();
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
          throw classStageNotFound();
        default:
          throw unkownException(error.message);
      }
    }
  };

  deleteClassStage = async (class_stage_guid: string) => {
    const deletedClassStage = await this.classStage.deleteClassStage(
      class_stage_guid,
      this.returningFields
    );

    if (!deletedClassStage) {
      throw classStageNotFound();
    }

    return deletedClassStage;
  };
}
