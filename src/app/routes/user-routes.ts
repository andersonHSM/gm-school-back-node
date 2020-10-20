import { KnexInstance } from '@config/index';
import { UserController } from '@controllers/user-controller';
import { UserService } from '@services/index';
import { Handler, Router } from 'express';

export const userRoutes = (router: Router): Router => {
  const userService = new UserService(KnexInstance);

  const { index, delete: deleteController, update } = new UserController(userService);

  router.get('/', (index as unknown) as Handler);

  router.delete('/:user_guid', (deleteController as unknown) as Handler);

  router.patch('/:user_guid', (update as unknown) as Handler);

  return router;
};
