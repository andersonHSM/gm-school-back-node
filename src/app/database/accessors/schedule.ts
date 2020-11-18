import { KnexInstance } from '@config/index';
import { ScheduleModel } from '@models/entities';
import { ScheduleInsertPayload } from '@models/requests/schedule';
import { query } from 'express';
import Knex, { QueryBuilder } from 'knex';
import { parse as uuidParse, stringify as uuidStringify, v4 as uuidv4 } from 'uuid';

export class Schedule {
  constructor(private readonly knex: Knex) {}
  private readonly baseQuery = KnexInstance('schedule');

  insertSchedule = async (returningFields: string[], payload: ScheduleInsertPayload) => {
    const schedule_guid = uuidv4();

    const [{ schedule_guid: queryGuid, ...remainingData }]: ScheduleModel[] = await this.knex(
      'schedule'
    )
      .insert({
        schedule_guid: uuidParse(schedule_guid),
        ...payload,
      })
      .returning(returningFields);

    return { schedule_guid, ...remainingData };
  };

  getExistingSchedule = async (week_day: number, begin_time: string, end_time: string) => {
    const schedule: ScheduleModel = await this.knex('schedule')
      .where({ week_day, begin_time, end_time })
      .first();

    return schedule;
  };

  getConflictingScheduleByBeginTime = async (
    week_day: number,
    begin_time: string,
    end_time: string
  ) => {
    console.log({ begin_time, end_time });
    const schedule: ScheduleModel = await this.knex('schedule')
      .where({ week_day })
      .where('begin_time', '>=', begin_time)
      .where('begin_time', '<', end_time)
      .first();

    return schedule;
  };

  getConflictingScheduleByEndTime = async (
    week_day: number,
    begin_time: string,
    end_time: string
  ) => {
    const schedule: ScheduleModel = await this.knex('schedule')
      .where({ week_day })
      .where('end_time', '>', begin_time)
      .where('end_time', '<=', end_time)
      .first();

    return schedule;
  };
  /*  


  private insert = (schedule_guid: ArrayLike<number>, payload: ScheduleInsertPayload) => (
    query: QueryBuilder
  ) => query.insert<any>({ schedule_guid, ...payload });


  private findConflictingBeginTime(week_day: number, begin_time: string, end_time: string) {
    return function (query: QueryBuilder) {
      return query.where({ week_day }).whereBetween('begin_time', [begin_time, end_time]);
    };
  } */
}
