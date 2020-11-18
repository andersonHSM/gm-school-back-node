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
  const { store } = new ScheduleController(scheduleService);

  router.post('/', (isAdmin as unknown) as Handler, (store as unknown) as Handler);

  return router;
};
