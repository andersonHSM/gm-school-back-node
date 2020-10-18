import { Router } from 'express';
import { AuthController } from '@controllers/index';
import { AuthService, JwtService } from '@services/index';

import { EnviromentConfig, KnexInstance } from '@config/index';

export const authRoutes = (router: Router): Router => {
  const jwtService = new JwtService(EnviromentConfig);

  const authService = new AuthService(jwtService, KnexInstance, EnviromentConfig);

  const authController = new AuthController(authService);

  const { show /* store */ } = authController;

  router.post('/login', show);

  router.post('/signup', (req, res) => {
    authController.store(req as any, res);
  });

  return router;
};
