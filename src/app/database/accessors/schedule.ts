import { KnexInstance } from '@config/index';
import { ScheduleModel } from '@models/entities';
import { ScheduleInsertPayload, ScheduleUpdatePayload } from '@models/requests/schedule';
import Knex from 'knex';
import { parse as uuidParse, stringify as uuidStringify, v4 as uuidv4 } from 'uuid';

export class Schedule {
  constructor(private readonly knex: Knex) {}

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

  updateSchedule = async (
    schedule_guid: string,
    returningFields: string[],
    payload: ScheduleUpdatePayload
  ) => {
    const binaryGuid = uuidParse(schedule_guid);

    const [schedule]: ScheduleModel[] = await this.knex('schedule')
      .where('schedule_guid', binaryGuid)
      .update(payload)
      .returning(returningFields);

    return { ...schedule, schedule_guid };
  };

  deleteSchedule = async (schedule_guid: string) => {
    const [deletedSchedule]: ScheduleModel[] = await this.knex('schedule')
      .where('schedule_guid', uuidParse(schedule_guid))
      .update('deleted_at', this.knex.fn.now())
      .returning('*');

    return deletedSchedule;
  };

  getExistingSchedule = async (week_day: number | string, begin_time: string, end_time: string) => {
    const schedule: ScheduleModel = await this.knex('schedule')
      .where({ week_day, begin_time, end_time })
      .first();

    return schedule;
  };

  getConflictingScheduleByBeginTime = async (
    week_day: number | string,
    begin_time: string,
    end_time: string
  ) => {
    const schedule: ScheduleModel = await this.knex('schedule')
      .where({ week_day })
      .where('begin_time', '>=', begin_time)
      .where('begin_time', '<', end_time)
      .first();

    return schedule;
  };

  getConflictingScheduleByEndTime = async (
    week_day: number | string,
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

  getAllActiveSchedules = async (returningFields: string[]) => {
    const schedules: ScheduleModel[] = await this.knex('schedule')
      .select(returningFields)
      .whereNull('deleted_at')
      .orderBy([{ column: 'week_day', order: 'asc' }, 'begin_time']);

    return schedules.map(({ schedule_guid, ...data }) => ({
      schedule_guid: uuidStringify(schedule_guid as ArrayLike<number>),
      ...data,
    }));
  };

  getScheduleByGuid = async (
    schedule_guid: string,
    returningFields: string[]
  ): Promise<ScheduleModel | null> => {
    const binaryGuid = uuidParse(schedule_guid);

    const schedule: ScheduleModel = await this.knex('schedule')
      .select(returningFields)
      .where('schedule_guid', binaryGuid)
      .whereNull('deleted_at')
      .first();

    if (!schedule) return null;

    const { schedule_guid: queryGuid, ...data } = schedule;

    return { schedule_guid, ...data };
  };

  getSchedulesByGuidsInterval = async (schedule_guids: string[], returningFields: string[]) => {
    const binaryGuids = schedule_guids.map(guid => uuidParse(guid));

    const schedules: ScheduleModel[] = await this.knex('schedule')
      .whereIn('schedule_guid', binaryGuids)
      .select(returningFields)
      .orderBy('week_day')
      .orderBy('begin_time');

    if (schedules.length === 0) {
      return [];
    }

    return schedules.map(({ schedule_guid, ...data }) => {
      return { schedule_guid: uuidStringify(schedule_guid as ArrayLike<number>), ...data };
    });
  };
}
