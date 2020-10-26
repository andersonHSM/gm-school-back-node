import { ClassModel } from '@models/entities';
import { ClassInsertPayload, ClassUpdatePayload } from '@models/requests/class';
import Knex from 'knex';
import { v4 as uuidv4, parse as uuidParse, stringify as uuidStringfy } from 'uuid';

export class Class {
  constructor(private readonly knex: Knex) {}

  getClass = async (class_guid: string | ArrayLike<number>, returningFields: string[]) => {
    const {
      class_guid: queryClassGuid,
      class_stage_guid: queryClassStageGuid,
      ...classReturn
    }: ClassModel = await this.knex('class')
      .select([...returningFields, 'class.class_guid'])
      .where({ ['class.class_guid']: this.verifyUuid(class_guid) })
      .whereNull('class.deleted_at')
      .first();

    return {
      class_guid,
      ...classReturn,
      class_stage_guid: uuidStringfy(queryClassGuid as ArrayLike<number>),
    };
  };

  getAllClasses = async (returningFields: string[]) => {
    const classes = (
      await this.knex('class')
        .select([...returningFields, 'class.class_guid'])
        .whereNull('deleted_at')
    ).map((classReturn: ClassModel) => {
      const { class_guid, class_stage_guid } = classReturn;
      return {
        ...classReturn,
        class_guid: uuidStringfy(class_guid as ArrayLike<number>),
        class_stage_guid: uuidStringfy(class_stage_guid as ArrayLike<number>),
      };
    });

    return classes;
  };

  insertClass = async (payload: ClassInsertPayload, returningFields: string[]) => {
    const class_stage_guid = this.verifyUuid(payload.class_stage_guid);
    const class_guid = this.verifyUuid(uuidv4());

    const finalPayload = { ...payload, class_stage_guid, class_guid };

    const [classReturn]: ClassModel[] = await this.knex('class')
      .insert(finalPayload)
      .returning([...returningFields, 'class_guid']);

    return {
      ...classReturn,
      class_guid: uuidStringfy(class_guid),
      class_stage_guid: payload.class_stage_guid,
    };
  };

  deleteClass = async (class_guid: string) => {
    const [classReturn] = await this.knex('class')
      .where({ class_guid: this.verifyUuid(class_guid) })
      .update('deleted_at', this.knex.fn.now())
      .returning('*');

    return classReturn;
  };

  updateClass = async (
    class_guid: string,
    returningFields: string[],
    payload: ClassUpdatePayload
  ) => {
    const binaryClassGuid = this.verifyUuid(class_guid);
    const finalPayload = {
      ...payload,
      class_stage_guid: this.verifyUuid(payload.class_stage_guid),
    };

    const [
      { class_guid: queryClassGuid, class_stage_guid: queryClassStageGuid, ...remaningClassData },
    ]: ClassModel[] = await this.knex('class')
      .where({ class_guid: binaryClassGuid })
      .whereNull('deleted_at')
      .update(finalPayload)
      .returning(returningFields);

    return {
      class_guid,
      ...remaningClassData,
      class_stage_guid: payload.class_stage_guid,
    };
  };

  private verifyUuid = (guid: string | ArrayLike<number>): ArrayLike<number> => {
    return typeof guid === 'string' ? uuidParse(guid) : guid;
  };
}
