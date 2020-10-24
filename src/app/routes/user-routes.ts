import { KnexInstance } from '@config/index';
import { UserController } from '@controllers/user-controller';
import { Address, PersonalData, Role, User } from '@database/accessors';
import { RoleMiddlewares } from '@middlewares/index';
import { UserService } from '@services/index';
import { Handler, Router } from 'express';

export const userRoutes = (roleMiddlewares: RoleMiddlewares) => {
  const router = Router();
  const { isAdmin } = roleMiddlewares;

  const userService = new UserService(
    new User(KnexInstance),
    new Address(KnexInstance),
    new PersonalData(KnexInstance),
    new Role(KnexInstance)
  );

  const { index, delete: deleteController, update } = new UserController(userService);

  router.get('/', (isAdmin as unknown) as Handler, (index as unknown) as Handler);

  router.delete('/:user_guid', (deleteController as unknown) as Handler);

  router.patch('/:user_guid', (update as unknown) as Handler);

  return router;
};
