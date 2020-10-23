import { KnexInstance } from '@config/index';
import { UserController } from '@controllers/user-controller';
import { Address, PersonalData, Role, User } from '@database/accessors';
import { UserService } from '@services/index';
import { Handler, Router } from 'express';

const router = Router();

const userService = new UserService(
  new User(KnexInstance),
  new Address(KnexInstance),
  new PersonalData(KnexInstance),
  new Role(KnexInstance)
);

const { index, delete: deleteController, update } = new UserController(userService);

router.get('/', (index as unknown) as Handler);

router.delete('/:user_guid', (deleteController as unknown) as Handler);

router.patch('/:user_guid', (update as unknown) as Handler);

export default router;
