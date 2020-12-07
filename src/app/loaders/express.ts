import express, { json, Request, Response } from 'express';
import cors from 'cors';

import {
  addressRoutes,
  authRoutes,
  classRoutes,
  classStageRoutes,
  disciplineRoutes,
  userRoutes,
  scheduleRoutes,
  frequencyRoutes,
} from '@routes/';
import { JwtService } from '@services/';
import { EnviromentConfig, KnexInstance } from '@config/';
import { AuthMiddleware, RoleMiddlewares } from '@middlewares/';
import { Role } from '@database/accessors';

export default async (app: express.Application) => {
  const jwtService = new JwtService(EnviromentConfig);
  const { validate: authMiddleware } = new AuthMiddleware(jwtService);
  const roleMiddlewares = new RoleMiddlewares(new Role(KnexInstance));

  app.use(cors());
  app.use(json());

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello World!' });
  });

  app.use('/auth/', authRoutes);

  app.use(authMiddleware);

  app.use('/users/', userRoutes(roleMiddlewares));

  app.use('/addresses/', addressRoutes(roleMiddlewares));

  app.use('/classes/', classRoutes(roleMiddlewares));

  app.use('/disciplines/', disciplineRoutes(roleMiddlewares));

  app.use('/class-stage/', classStageRoutes(roleMiddlewares));

  app.use('/schedules/', scheduleRoutes(roleMiddlewares));

  app.use('/frequency', frequencyRoutes(roleMiddlewares));

  return app;
};
