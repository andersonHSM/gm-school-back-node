import { KnexInstance } from '@config/index';
import { DisciplineController } from '@controllers/index';
import { Discipline } from '@database/accessors';
import { RoleMiddlewares } from '@middlewares/index';
import { DisciplineService } from '@services/index';
import { Handler, Router } from 'express';

export const disciplineRoutes = (roleMiddlewares: RoleMiddlewares) => {
  const router = Router();
  const { isAdmin } = roleMiddlewares;

  const disciplineService = new DisciplineService(new Discipline(KnexInstance));

  const { store, update, delete: deleteFn } = new DisciplineController(disciplineService);

  router.post('/', (isAdmin as unknown) as Handler, (store as unknown) as Handler);

  router.patch(
    '/:discipline_guid',
    (isAdmin as unknown) as Handler,
    (update as unknown) as Handler
  );

  router.delete(
    '/:discipline_guid',
    (isAdmin as unknown) as Handler,
    (deleteFn as unknown) as Handler
  );

  return router;
};
