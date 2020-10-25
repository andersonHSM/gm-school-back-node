import { ClassModel } from '@models/entities/';

export type ClassInsertPayload = Required<Omit<ClassModel, 'class_guid'>>;
