import { ClassStageModel } from '@models/entities';
import { ClassStageInsertPayload, ClassStageUpdatePayload } from '@models/requests/class-stage';
import Knex from 'knex';
import { v4 as uuidv4, parse as uuidParse, stringify as uuidStringfy } from 'uuid';

export class ClassStage {
  constructor(private readonly knex: Knex) {}

  getAllActiveClassStages = async (returningFields: string[]) => {
    let classStages: ClassStageModel[] = await this.knex('class_stage')
      .select(returningFields)
      .whereNull('deleted_at');

    return classStages.map(({ description, class_stage_guid }) => ({
      class_stage_guid: uuidStringfy(class_stage_guid as ArrayLike<number>),
      description,
    }));
  };

  insertClassStage = async (returningFields: string[], payload: ClassStageInsertPayload) => {
    const class_stage_guid = uuidv4();
    const binaryClassStageGuid = uuidParse(class_stage_guid);

    if (await this.verifyExistingClassStage(payload.description)) {
      return null;
    }

    const finalPayload = { ...payload, class_stage_guid: binaryClassStageGuid };

    const [{ description }]: ClassStageModel[] = await this.knex('class_stage')
      .insert(finalPayload)
      .returning(returningFields);

    return { description, class_stage_guid };
  };

  getActiveClassStageByGuid = async (
    class_stage_guid: string | ArrayLike<number>,
    returningFields: string[]
  ) => {
    const guid = this.verifyUuid(class_stage_guid);

    const { description }: ClassStageModel = await this.knex('class_stage')
      .select(returningFields)
      .where({ class_stage_guid: guid })
      .whereNull('deleted_at')
      .first();

    return { class_stage_guid, description };
  };

  updateClassStage = async (
    class_stage_guid: string | ArrayLike<number>,
    returningFields: string[],
    payload: ClassStageUpdatePayload
  ) => {
    const binaryGuid = this.verifyUuid(class_stage_guid);

    if (await this.verifyExistingClassStage(payload.description)) {
      return null;
    }

    const [{ description }]: ClassStageModel[] = await this.knex('class_stage')
      .where({ class_stage_guid: binaryGuid })
      .update(payload)
      .returning(returningFields);

    return { class_stage_guid, description };
  };

  deleteClassStage = async (
    class_stage_guid: string | ArrayLike<number>,
    returningFields: string[]
  ) => {
    const binaryGuid = this.verifyUuid(class_stage_guid);

    const [deletedClassStage] = await this.knex('class_stage')
      .where({ class_stage_guid: binaryGuid })
      .update('deleted_at', null)
      .returning([...returningFields, 'deleted_at']);

    return deletedClassStage;
  };

  private verifyUuid = (guid: string | ArrayLike<number>): ArrayLike<number> => {
    return typeof guid === 'string' ? uuidParse(guid) : guid;
  };

  verifyExistingClassStage = async (description: string) => {
    const classStage = await this.knex('class_stage')
      .where({ description })
      .returning(['description'])
      .whereNull('deleted_at')
      .first();

    return !!classStage;
  };
}
