import { KnexInstance } from '@config/index';
import { ClassStageController } from '@controllers/index';
import { ClassStage } from '@database/accessors';
import { RoleMiddlewares } from '@middlewares/index';
import { Handler, Router } from 'express';

export const classStageRoutes = (roleMiddlewares: RoleMiddlewares) => {
  const router = Router();
  const { isAdmin } = roleMiddlewares;

  const classStage = new ClassStage(KnexInstance);
  const { store } = new ClassStageController(classStage);

  router.post('/', (isAdmin as unknown) as Handler, (store as unknown) as Handler);

  return router;
};
