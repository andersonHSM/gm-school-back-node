import { ClassModel } from '@models/entities/';

export type ClassUpdatePayload = Partial<Omit<ClassModel, 'class_guid' | 'class_stage_guid'>> &
  Pick<ClassModel, 'class_stage_guid'>;
