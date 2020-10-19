import express, { Handler, json, Request, Response } from 'express';
import cors from 'cors';

import { authRoutes, userRoutes } from '@routes/index';
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

  app.use(authMiddleware as Handler);

  app.use('/user', userRoutes(router));

  return app;
};
