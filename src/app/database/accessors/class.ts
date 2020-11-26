import {
  ClassHasDisciplineHasScheduleModel,
  ClassHasDisciplineModel,
  ClassModel,
} from '@models/entities';
import {
  ClassInsertPayload,
  ClassUpdatePayload,
  SetDisciplinesToClassRequestPayload,
} from '@models/requests/class';
import Knex from 'knex';
import { v4 as uuidv4, parse as uuidParse, stringify as uuidStringfy } from 'uuid';

type finalSetDisciplineToClassPayload = {
  class_has_discipline_guid: string | ArrayLike<number>;
  class_guid: string | ArrayLike<number>;
  discipline_guid: string | ArrayLike<number>;
  workload: number;
  filled_workload: number;
}[];

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

  setDisciplinesToClass = async (
    class_guid: string,
    returningFields: string[],
    payload: SetDisciplinesToClassRequestPayload
  ) => {
    const binaryClassGuid = this.verifyUuid(class_guid);

    const finalPayload = payload.map(({ discipline_guid, workload }) => ({
      discipline_guid: this.verifyUuid(discipline_guid as string),
      class_guid: binaryClassGuid,
      class_has_discipline_guid: uuidParse(uuidv4()),
      workload,
    }));

    const queryReturn: finalSetDisciplineToClassPayload = await this.knex('class_has_discipline')
      .insert(finalPayload)
      .returning(returningFields);

    return queryReturn.map(
      ({ class_guid, discipline_guid, class_has_discipline_guid, ...remaining }) => {
        return {
          class_has_discipline_guid: uuidStringfy(class_has_discipline_guid as ArrayLike<number>),
          class_guid: uuidStringfy(class_guid as ArrayLike<number>),
          discipline_guid: uuidStringfy(discipline_guid as ArrayLike<number>),
          ...remaining,
        };
      }
    );
  };

  unsetDisciplineToClass = async (
    class_guid: string | ArrayLike<number>,
    discipline_guid: string | ArrayLike<number>,
    returningFields: string[]
  ) => {
    const binaryClassGuid = this.verifyUuid(class_guid);
    const binaryDisciplineGuid = this.verifyUuid(discipline_guid);

    const [{ class_has_discipline_guid, deleted_at }] = await this.knex('class_has_discipline')
      .where({ class_guid: binaryClassGuid, discipline_guid: binaryDisciplineGuid })
      .update('deleted_at', this.knex.fn.now())
      .returning([...returningFields, 'deleted_at']);

    return {
      class_has_discipline_guid: uuidStringfy(class_has_discipline_guid),
      class_guid,
      discipline_guid,
      deleted_at,
    };
  };

  setScheduleToClassByDiscipline = async (
    returningFields: string[],
    payload: Omit<ClassHasDisciplineHasScheduleModel, 'class_has_discipline_has_schedule_guid'>[]
  ) => {
    const finalPayload = payload.map(({ class_has_discipline_guid, schedule_guid, class_date }) => {
      const binaryClassHasDisciplineGuid = uuidParse(class_has_discipline_guid as string);
      const binaryScheduleGuids = uuidParse(schedule_guid as string);
      const class_has_discipline_has_schedule_guid = uuidParse(uuidv4());
      return {
        class_has_discipline_has_schedule_guid,
        class_has_discipline_guid: binaryClassHasDisciplineGuid,
        schedule_guid: binaryScheduleGuids,
        class_date,
      };
    });

    const insertedSchedules: ClassHasDisciplineHasScheduleModel[] = await this.knex(
      'class_has_discipline_has_schedule'
    )
      .insert(finalPayload)
      .returning(returningFields);

    return insertedSchedules.map(
      ({
        class_has_discipline_guid,
        class_has_discipline_has_schedule_guid,
        schedule_guid,
        class_date,
      }) => {
        return {
          class_has_discipline_has_schedule_guid: uuidStringfy(
            class_has_discipline_has_schedule_guid as ArrayLike<number>
          ),
          class_has_discipline_guid: uuidStringfy(class_has_discipline_guid as ArrayLike<number>),
          schedule_guid: uuidStringfy(schedule_guid as ArrayLike<number>),
          class_date,
        };
      }
    );
  };

  private verifyUuid = (guid: string | ArrayLike<number>): ArrayLike<number> => {
    return typeof guid === 'string' ? uuidParse(guid) : guid;
  };

  verifyExistingClass = async (class_guid: string): Promise<ClassModel> => {
    const binaryGuid = this.verifyUuid(class_guid);
    return await this.knex('class')
      .where({ class_guid: binaryGuid })
      .whereNull('deleted_at')
      .select(['*'])
      .first();
  };

  verifyExistingClassDiscipline = async (class_guid: string, discipline_guid: string) => {
    const binaryClassGuid = this.verifyUuid(class_guid);
    const binaryDisciplineGuid = this.verifyUuid(discipline_guid);

    return await this.knex('class_has_discipline')
      .where({
        class_guid: binaryClassGuid,
        discipline_guid: binaryDisciplineGuid,
      })
      .whereNull('deleted_at')
      .returning('*')
      .first();
  };

  verifyExistingClassDisciplineSchedule = async (
    class_has_discipline_guids: string[],
    schedule_guids: string[]
  ) => {
    const binaryClassHasDisciplineGuids = class_has_discipline_guids.map(guid => uuidParse(guid));
    const binaryScheduleGuids = schedule_guids.map(guid => uuidParse(guid));

    return await this.knex('class_has_discipline_has_schedule')
      .whereIn('class_has_discipline_guid', binaryClassHasDisciplineGuids)
      .whereIn('schedule_guid', binaryScheduleGuids);
  };

  getClassHasDisciplineByGuid = async (
    class_has_discipline_guid: string,
    returningFields: string[]
  ) => {
    const binaryGuid = uuidParse(class_has_discipline_guid);

    const classHasDiscipline: ClassHasDisciplineModel = await this.knex('class_has_discipline')
      .where('class_has_discipline_guid', binaryGuid)
      .select(returningFields)
      .first();

    if (!classHasDiscipline) return null;

    return {
      class_has_discipline_guid,
      class_guid: uuidStringfy(classHasDiscipline.class_guid as ArrayLike<number>),
      discipline_guid: uuidStringfy(classHasDiscipline.discipline_guid as ArrayLike<number>),
      workload: classHasDiscipline.workload,
      filled_workload: classHasDiscipline.filled_workload,
    };
  };
}
