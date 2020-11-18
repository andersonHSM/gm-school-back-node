export interface ScheduleModel {
  schedule_guid: string | ArrayLike<number>;
  week_day: number;
  begin_time: string;
  end_time: string;
}
