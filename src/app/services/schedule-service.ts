import { Schedule } from '@database/accessors';
import {
  scheduleAlreadyExistsException,
  scheduleNotFoundException,
} from '@exceptions/schedule-exceptions';
import { ScheduleInsertPayload } from '@models/requests/schedule';

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

    const [
      existingExactlySchedule,
      conflictingScheduleByBeginTime,
      conflictingScheduleByEndTime,
    ] = await Promise.all([
      this.schedule.getExistingSchedule(payloadWeekDay, payloadBeginTime, payloadEndTime),
      this.schedule.getConflictingScheduleByBeginTime(
        payloadWeekDay,
        payloadBeginTime,
        payloadEndTime
      ),
      this.schedule.getConflictingScheduleByEndTime(
        payloadWeekDay,
        payloadBeginTime,
        payloadEndTime
      ),
    ]);

    if (existingExactlySchedule || conflictingScheduleByBeginTime || conflictingScheduleByEndTime) {
      throw scheduleAlreadyExistsException();
    }

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
}
