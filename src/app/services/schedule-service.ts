import { Schedule } from '@database/accessors';
import {
  scheduleAlreadyExistsException,
  scheduleNotFoundException,
} from '@exceptions/schedule-exceptions';
import { fieldMessageException } from '@exceptions/schema';
import { ScheduleInsertPayload, ScheduleUpdatePayload } from '@models/requests/schedule';
import Joi from 'joi';

export class ScheduleService {
  constructor(private readonly schedule: Schedule) {}

  private readonly scheduleReturningFields = [
    'schedule.schedule_guid',
    'schedule.week_day',
    'schedule.begin_time',
    'schedule.end_time',
  ];

  insertSchedule = async (payload: ScheduleInsertPayload) => {
    const {
      week_day: payloadWeekDay,
      begin_time: payloadBeginTime,
      end_time: payloadEndTime,
    } = payload;

    await this.validateExistingSchedules(payloadWeekDay, payloadBeginTime, payloadEndTime);

    return await this.schedule.insertSchedule(this.scheduleReturningFields, payload);
  };

  getAllActiveSchedules = async () => {
    return await this.schedule.getAllActiveSchedules(this.scheduleReturningFields);
  };

  deleteSchedule = async (schedule_guid: string) => {
    const deletedSchedule = await this.schedule.deleteSchedule(schedule_guid);

    if (!deletedSchedule) {
      throw scheduleNotFoundException();
    }

    return deletedSchedule;
  };

  updateSchedule = async (schedule_guid: string, payload: ScheduleUpdatePayload) => {
    const schema = Joi.object({
      week_day: Joi.string()
        .regex(/0|1|2|3|4|5|6/)
        .message('week_day must me in the range of 0-6'),
      begin_time: Joi.string()
        .regex(/^\d{2}:\d{2}:\d{2}$/)
        .message('begin_time must be in the following format: 00:00:00'),
      end_Time: Joi.string()
        .regex(/^\d{2}:\d{2}:\d{2}$/)
        .message('end_Time must be in the following format: 00:00:00'),
    });

    try {
      await schema.validateAsync(payload);
    } catch (error) {
      throw fieldMessageException(error.message);
    }

    const schedule = await this.schedule.getScheduleByGuid(
      schedule_guid,
      this.scheduleReturningFields
    );

    if (!schedule) {
      throw scheduleNotFoundException();
    }

    const { schedule_guid: queryGuid, ...data } = schedule;

    const { week_day: payloadWeekDay, begin_time: payloadBeginTime, end_time: payloadEndTime } = {
      ...data,
      ...payload,
    };

    await this.validateExistingSchedules(payloadWeekDay, payloadBeginTime, payloadEndTime);

    return await this.schedule.updateSchedule(schedule_guid, this.scheduleReturningFields, payload);
  };

  retrieveSchedule = async (schedule_guid: string) => {
    const schedule = await this.schedule.getScheduleByGuid(
      schedule_guid,
      this.scheduleReturningFields
    );

    if (!schedule) {
      throw scheduleNotFoundException();
    }

    return { ...schedule, schedule_guid };
  };

  setScheduleAsExamDate = async (
    class_has_discipline_has_schedule_guid: string,
    payload: boolean
  ) => {
    console.log({ payload, class_has_discipline_has_schedule_guid });
    return await this.schedule.setScheduleAsExamDate(
      class_has_discipline_has_schedule_guid,
      payload
    );
  };

  private validateExistingSchedules = async (
    week_day: number | string,
    begin_time: string,
    end_time: string
  ) => {
    const [
      existingExactlySchedule,
      conflictingScheduleByBeginTime,
      conflictingScheduleByEndTime,
    ] = await Promise.all([
      this.schedule.getExistingSchedule(week_day, begin_time, end_time),
      this.schedule.getConflictingScheduleByBeginTime(week_day, begin_time, end_time),
      this.schedule.getConflictingScheduleByEndTime(week_day, begin_time, end_time),
    ]);

    if (existingExactlySchedule || conflictingScheduleByBeginTime || conflictingScheduleByEndTime) {
      throw scheduleAlreadyExistsException();
    }
  };
}
