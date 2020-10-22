import express, { json, Request, Response } from 'express';
import cors from 'cors';

import { addressRoutes, authRoutes, userRoutes } from '@routes/index';
import { JwtService } from '@services/index';
import { EnviromentConfig } from '@config/index';
import { AuthMiddleware } from '@middlewares/index';

export default async (app: express.Application) => {
  const router = express.Router();

  const jwtService = new JwtService(EnviromentConfig);
  const { validate: authMiddleware } = new AuthMiddleware(jwtService);

  app.use(cors());
  app.use(json());

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello World!' });
  });

  app.use('/auth', authRoutes(router));

  app.use(authMiddleware);

  app.use('/users', userRoutes(router));

  app.use('/addresses', addressRoutes(router));

  return app;
};
