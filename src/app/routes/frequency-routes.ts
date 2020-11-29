import { Router } from 'express';
import { FrequencyService } from '@services/index';

import { KnexInstance } from '@config/index';
import { FrequencyController } from '@controllers/';
import { Frequency } from '@database/accessors';
import { RoleMiddlewares } from '@middlewares/index';

export const frequencyRoutes = (roleMiddlewares: RoleMiddlewares) => {
  const router = Router();

  const { isAdmin } = roleMiddlewares;

  const frequencyService = new FrequencyService(new Frequency(KnexInstance));

  const { index, store, update, delete: controllerDeleteFn, show } = new FrequencyController(
    frequencyService
  );

  return router;
};
