import { DisciplineModel } from '@models/entities';

export type DisciplineUpdatePayload = Pick<DisciplineModel, 'description'>;
