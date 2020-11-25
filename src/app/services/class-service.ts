import { Class, Discipline, Schedule } from '@database/accessors';
import {
  classDisciplineAlredyWithScheduleException,
  classNotFoundException,
  invalidClassPayloadException,
} from '@exceptions/class-exceptions';
import { disciplineNotFoundException } from '@exceptions/discipline-exceptions';
import { unkownException } from '@exceptions/index';
import { fieldMessageException } from '@exceptions/schema';
import {
  ClassInsertPayload,
  ClassUpdatePayload,
  SetDisciplinesToClassRequestPayload,
  SetScheduleToClassByDisciplinePayload,
} from '@models/requests/class';
import { set as setDate } from 'date-fns';
import Joi from 'joi';
import { clone } from 'ramda';

export class ClassService {
  constructor(
    private readonly classEntity: Class,
    private readonly discipline: Discipline,
    private readonly schedule: Schedule
  ) {}

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
    'class_has_discipline.workload',
    'class_has_discipline.filled_workload',
  ];

  private readonly classHasDisciplineHasScheduleReturningFields = [
    'class_has_discipline_has_schedule.class_has_discipline_has_schedule_guid',
    'class_has_discipline_has_schedule.class_has_discipline_guid',
    'class_has_discipline_has_schedule.schedule_guid',
  ];

  private readonly scheduleReturningFields = [
    'schedule.schedule_guid',
    'schedule.week_day',
    'schedule.begin_time',
    'schedule.end_time',
  ];

  getClass = async (class_guid: string) => {
    try {
      return await this.classEntity.getClass(class_guid, this.returningFields);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'class_guid' of undefined":
        default:
          throw classNotFoundException();
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
      throw invalidClassPayloadException();
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
      throw invalidClassPayloadException();
    }

    try {
      return await this.classEntity.updateClass(class_guid, this.returningFields, payload);
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'class_guid' of undefined":
        default:
          throw classNotFoundException();
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
          throw classNotFoundException();
      }
    }
  };

  setDisciplinesToClass = async (
    class_guid: string,
    payload: SetDisciplinesToClassRequestPayload
  ) => {
    const existingClass = await this.classEntity.verifyExistingClass(class_guid);

    if (!existingClass) {
      throw classNotFoundException();
    }

    let finalPayload: any[] = [];

    for (const { discipline_guid, workload } of payload) {
      const [existingDiscipline, existingClassDiscipline] = await Promise.all([
        this.discipline.verifyExistingDiscipline(discipline_guid as string),
        this.classEntity.verifyExistingClassDiscipline(class_guid, discipline_guid as string),
      ]);

      if (!existingClassDiscipline && existingDiscipline) {
        finalPayload = finalPayload.concat({ discipline_guid, workload });
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
          throw unkownException(error.message);
      }
    }
  };

  unsetDisciplineToClass = async (class_guid: string, discipline_guid: string) => {
    const [existingClass, existingDiscipline] = await Promise.all([
      this.classEntity.verifyExistingClass(class_guid),
      this.discipline.verifyExistingDiscipline(discipline_guid),
    ]);

    if (!existingClass) {
      throw classNotFoundException();
    } else if (!existingDiscipline) {
      throw disciplineNotFoundException();
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
          throw unkownException(error.message);
      }
    }
  };

  getActiveClassWithDisciplines = async (class_guid: string) => {
    const existingClass = await this.classEntity.verifyExistingClass(class_guid);

    if (!existingClass) {
      throw classNotFoundException();
    }

    try {
      const classReturn = await this.classEntity.getClass(class_guid, this.returningFields);
      const disciplines = await this.discipline.getDisciplineByClassGuid(class_guid);

      return { ...classReturn, disciplines };
    } catch (error) {
      switch (error.message) {
        default:
          throw unkownException(error.message);
      }
    }
  };

  setScheduleToClassByDiscipline = async (payload: SetScheduleToClassByDisciplinePayload) => {
    const schema = Joi.array().items({
      class_has_discipline_guid: Joi.string().required(),
      schedule_guids: Joi.array().items(Joi.string()).required(),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw fieldMessageException(error.message);
    }

    console.log(payload[0].schedule_guids);

    const removedDuplicateds = this.removeDuplicatedSchedule(payload);

    console.log(removedDuplicateds[0].schedule_guids);
    await this.calculateSchedulesDates(removedDuplicateds);

    return;

    await this.verifyExistingSchedulesByClassDiscipline(removedDuplicateds);

    return await this.classEntity.setScheduleToClassByDiscipline(
      this.classHasDisciplineHasScheduleReturningFields,
      removedDuplicateds
    );
  };

  private removeDuplicatedSchedule = (arr: SetScheduleToClassByDisciplinePayload) => {
    return arr.reduce((acc, current) => {
      const existingValue = acc.find(
        item => item.class_has_discipline_guid === current.class_has_discipline_guid
      );

      if (!existingValue) {
        const { class_has_discipline_guid, schedule_guids } = current;

        return acc.concat({
          class_has_discipline_guid,
          schedule_guids: Array.from(new Set(schedule_guids)),
        });
      } else {
        return acc;
      }
    }, [] as SetScheduleToClassByDisciplinePayload);
  };

  private verifyExistingSchedulesByClassDiscipline = async (
    arr: SetScheduleToClassByDisciplinePayload
  ) => {
    const guid1 = arr.map(({ class_has_discipline_guid }) => class_has_discipline_guid);
    const guid2 = arr.map(({ schedule_guids }) => schedule_guids);

    let relations: any[] = [];

    for (const scheduleguid of guid2) {
      const existingRelation = await this.classEntity.verifyExistingClassDisciplineSchedule(
        guid1,
        scheduleguid
      );

      relations = relations.concat(existingRelation);
    }

    if (relations.length > 0) {
      throw classDisciplineAlredyWithScheduleException();
    }
  };

  private calculateSchedulesDates = async (arr: SetScheduleToClassByDisciplinePayload) => {
    // TODO - create table to store this data, wich represents the beginning of the school year
    const startTime = setDate(Date.now(), { month: 0, date: 20 });
    const endTime = setDate(Date.now(), { month: 10, date: 20 });

    console.log({ startTime, endTime });

    for (const { class_has_discipline_guid, schedule_guids } of arr) {
      const classHasDiscipline = await this.classEntity.getClassHasDisciplineByGuid(
        class_has_discipline_guid,
        this.classHasDisciplineReturningFields
      );

      const schedules = await this.schedule.getSchedulesByGuidsInterval(
        schedule_guids,
        this.scheduleReturningFields
      );

      if (schedules.length === 0 || !classHasDiscipline) {
        return;
      }

      const scheduleStartTime = clone(startTime);

      console.log({ schedules, classHasDiscipline });
    }
  };
}
