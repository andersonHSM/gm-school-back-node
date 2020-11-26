import { ScheduleModel } from '@models/entities';

export type ScheduleUpdatePayload = Partial<Omit<ScheduleModel, 'schedule_guid'>>;
