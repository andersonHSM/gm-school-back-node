import { Router } from 'express';
import { AuthController } from '@controllers/index';

export const authRoutes = (router: Router): Router => {
  const authController = new AuthController();

  const { show } = authController;
  router.post('/login', show);

  return router;
};
