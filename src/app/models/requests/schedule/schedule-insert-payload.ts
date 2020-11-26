import { ScheduleModel } from '@models/entities';

export type ScheduleInsertPayload = Omit<ScheduleModel, 'schedule_guid'>;
