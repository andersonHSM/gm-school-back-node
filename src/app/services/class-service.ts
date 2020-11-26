import { Class, Discipline, Schedule } from '@database/accessors';
import {
  classDisciplineAlredyWithScheduleException,
  classNotFoundException,
  invalidClassPayloadException,
} from '@exceptions/class-exceptions';
import { disciplineNotFoundException } from '@exceptions/discipline-exceptions';
import { unkownException } from '@exceptions/index';
import { fieldMessageException } from '@exceptions/schema';
import { ClassHasDisciplineModel, ScheduleModel } from '@models/entities';
import {
  ClassInsertPayload,
  ClassUpdatePayload,
  SetDisciplinesToClassRequestPayload,
  SetScheduleToClassByDisciplinePayload,
} from '@models/requests/class';
import { differenceInMinutes, set as setDate, setDay, addDays, formatISO, isAfter } from 'date-fns';
import Joi from 'joi';
import { clone, includes } from 'ramda';

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
    'class_has_discipline_has_schedule.class_date',
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

    const removedDuplicateds = this.removeDuplicatedSchedule(payload);

    await this.verifyExistingSchedulesByClassDiscipline(removedDuplicateds);

    const finalPayload = await this.calculateSchedulesDates(removedDuplicateds);

    return await this.classEntity.setScheduleToClassByDiscipline(
      this.classHasDisciplineHasScheduleReturningFields,
      finalPayload as any
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

    let data: {
      classHasDiscipline: ClassHasDisciplineModel;
      schedules: ScheduleModel[];
    }[] = [];

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

      data = [...data, { classHasDiscipline, schedules }];
    }

    this.verifyConflictingSchedulesForClass(data);

    return data
      .map(({ classHasDiscipline, schedules }) => {
        let { workload, filled_workload } = classHasDiscipline;

        workload = workload * 60;

        let payloads: any = [];

        let date: Date = clone(startTime);

        while (filled_workload <= workload) {
          schedules.forEach(({ schedule_guid, week_day, begin_time, end_time }, index) => {
            const [beginTimeHour, beginTimeMinute, beginTimeSecond] = begin_time.split(':');
            const [endTimeHour, endTimeMinute, endTimeSecond] = end_time.split(':');

            const classBeginTime = setDate(new Date(), {
              hours: +beginTimeHour,
              minutes: +beginTimeMinute,
              seconds: +beginTimeSecond,
            });
            const clasEndTime = setDate(new Date(), {
              hours: +endTimeHour,
              minutes: +endTimeMinute,
              seconds: +endTimeSecond,
            });

            date = setDay(clone(date), week_day, { weekStartsOn: 0 });

            if (index === 0) {
              date = addDays(clone(date), 7);
            }

            const minutesOffset = differenceInMinutes(clasEndTime, classBeginTime);

            filled_workload += minutesOffset;

            if (filled_workload > workload || isAfter(date, endTime)) return;

            payloads = payloads.concat({
              class_has_discipline_guid: classHasDiscipline.class_has_discipline_guid,
              schedule_guid,
              class_date: formatISO(date, { representation: 'date' }),
            });
          });
        }

        return payloads;
      })
      .flat();
  };

  private verifyConflictingSchedulesForClass = (
    arr: {
      classHasDiscipline: ClassHasDisciplineModel;
      schedules: ScheduleModel[];
    }[]
  ) => {
    arr.reduce(
      (acc, current) => {
        if (acc.length > 0) {
          const found = acc.some(({ classHasDiscipline, schedules }) => {
            return (
              classHasDiscipline.class_guid === current.classHasDiscipline.class_guid &&
              schedules.some(el => {
                return includes(el, current.schedules);
              })
            );
          });

          if (found) {
            throw classDisciplineAlredyWithScheduleException();
          }
        }

        acc = acc.concat(current);
        return acc;
      },
      [] as {
        classHasDiscipline: ClassHasDisciplineModel;
        schedules: ScheduleModel[];
      }[]
    );
  };
}
