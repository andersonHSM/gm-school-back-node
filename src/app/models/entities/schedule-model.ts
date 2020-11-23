export interface ScheduleModel {
  schedule_guid: string | ArrayLike<number>;
  week_day: number | string;
  begin_time: string;
  end_time: string;
}
