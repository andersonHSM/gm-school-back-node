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

  const { index, store, show, delete: deleteFn, update } = new ClassController(classService);

  router.get('/', (isAdmin as unknown) as Handler, (index as unknown) as Handler);

  router.get('/:class_guid', (show as unknown) as Handler);

  router.patch('/:class_guid', (isAdmin as unknown) as Handler, (update as unknown) as Handler);

  router.delete('/:class_guid', (isAdmin as unknown) as Handler, (deleteFn as unknown) as Handler);

  router.post('/', (isAdmin as unknown) as Handler, (store as unknown) as Handler);

  return router;
};
