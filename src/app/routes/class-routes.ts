import { KnexInstance } from '@config/index';
import { ClassController } from '@controllers/index';
import { Class } from '@database/accessors';
import { RoleMiddlewares } from '@middlewares/index';
import { ClassService } from '@services/index';
import { Handler, Router } from 'express';

export const classRoutes = (roleMiddlewares: RoleMiddlewares) => {
  const router = Router();

  const { isAdmin } = roleMiddlewares;
  const classService = new ClassService(new Class(KnexInstance));

  const { index, store } = new ClassController(classService);

  router.get('/', (isAdmin as unknown) as Handler, (index as unknown) as Handler);

  router.post('/', (store as unknown) as Handler);

  return router;
};
