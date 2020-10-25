import { ClassModel } from '@models/entities';
import { ClassInsertPayload } from '@models/requests/class';
import Knex from 'knex';
import { v4 as uuidv4, parse as uuidParse, stringify as uuidStringfy } from 'uuid';

export class Class {
  constructor(private readonly knex: Knex) {}

  getAllClasses = async (returningFields: string[]) => {
    const classes: ClassModel[] = (
      await this.knex('class').select([...returningFields, 'class_guid'])
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

  private verifyUuid = (guid: string | ArrayLike<number>): ArrayLike<number> => {
    return typeof guid === 'string' ? uuidParse(guid) : guid;
  };
}
