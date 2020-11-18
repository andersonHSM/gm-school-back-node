import { KnexInstance } from '@config/index';
import { ScheduleController } from '@controllers/index';
import { Schedule } from '@database/accessors';
import { RoleMiddlewares } from '@middlewares/index';
import { ScheduleService } from '@services/index';
import { Handler, Router } from 'express';

export const scheduleRoutes = (roleMiddlewares: RoleMiddlewares) => {
  const router = Router();

  const { isAdmin } = roleMiddlewares;
  const scheduleService = new ScheduleService(new Schedule(KnexInstance));
  const { store, index, delete: deleteFn } = new ScheduleController(scheduleService);

  router.get('/', (isAdmin as unknown) as Handler, index);

  router.post('/', (isAdmin as unknown) as Handler, (store as unknown) as Handler);

  router.delete('/:schedule_guid', (isAdmin as unknown) as Handler, deleteFn);

  return router;
};
