import { KnexInstance } from '@config/index';
import { ClassStageController } from '@controllers/index';
import { ClassStage } from '@database/accessors';
import { RoleMiddlewares } from '@middlewares/index';
import { ClassStageService } from '@services/index';
import { Handler, Router } from 'express';

export const classStageRoutes = (roleMiddlewares: RoleMiddlewares) => {
  const router = Router();
  const { isAdmin } = roleMiddlewares;

  const classStage = new ClassStage(KnexInstance);
  const classStageService = new ClassStageService(classStage);
  const { store } = new ClassStageController(classStageService);

  router.post('/', (isAdmin as unknown) as Handler, (store as unknown) as Handler);

  return router;
};
