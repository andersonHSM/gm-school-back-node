import { DisciplineModel } from '@models/entities';

export type DisciplineInsertPayload = Pick<DisciplineModel, 'description'>;
