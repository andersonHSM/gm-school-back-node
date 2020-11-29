import { Handler, Router } from 'express';
import { FrequencyService } from '@services/index';

import { KnexInstance } from '@config/index';
import { FrequencyController } from '@controllers/';
import { Frequency } from '@database/accessors';
import { RoleMiddlewares } from '@middlewares/index';

export const frequencyRoutes = (roleMiddlewares: RoleMiddlewares) => {
  const router = Router();

  const { isAdminOrProfessorOrCoordinator } = roleMiddlewares;

  const frequencyService = new FrequencyService(new Frequency(KnexInstance));

  const { index, store, update, delete: controllerDeleteFn, show } = new FrequencyController(
    frequencyService
  );

  router.post(
    '/',
    (isAdminOrProfessorOrCoordinator as unknown) as Handler,
    (store as unknown) as Handler
  );

  return router;
};
