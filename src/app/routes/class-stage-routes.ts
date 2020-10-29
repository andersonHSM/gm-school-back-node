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
  const { store, index, show, update, delete: deleteFn } = new ClassStageController(
    classStageService
  );

  router.post('/', (isAdmin as unknown) as Handler, (store as unknown) as Handler);

  router.get('/', (isAdmin as unknown) as Handler, index);

  router.get('/:class_stage_guid', (isAdmin as unknown) as Handler, (show as unknown) as Handler);

  router.patch('/:class_stage_guid', (isAdmin as unknown) as Handler, update);

  router.delete('/:class_stage_guid', (isAdmin as unknown) as Handler, deleteFn);

  return router;
};
