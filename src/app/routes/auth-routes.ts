import { Router } from 'express';
import { AuthController } from '@controllers/index';
import { AuthService, JwtService } from '@services/index';

import { EnviromentConfig, KnexInstance } from '@config/index';
import { Address, PersonalData, Role, User } from '@database/accessors';

export const authRoutes = (router: Router): Router => {
  const jwtService = new JwtService(EnviromentConfig);

  const authService = new AuthService(
    jwtService,
    EnviromentConfig,
    new User(KnexInstance),
    new PersonalData(KnexInstance),
    new Address(KnexInstance),
    new Role(KnexInstance)
  );

  const authController = new AuthController(authService);

  const { show, store } = authController;

  router.post('/login', show);

  router.post('/signup', store);

  return router;
};
