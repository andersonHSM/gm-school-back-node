import { Schedule } from '@database/accessors';
import { scheduleAlreadyExistsException } from '@exceptions/schedule-exceptions';
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

    console.log({
      existingExactlySchedule,
      conflictingScheduleByBeginTime,
      conflictingScheduleByEndTime,
    });

    if (existingExactlySchedule || conflictingScheduleByBeginTime || conflictingScheduleByEndTime) {
      throw scheduleAlreadyExistsException();
    }

    return await this.schedule.insertSchedule(this.scheduleReturningFields, payload);
  };
}
