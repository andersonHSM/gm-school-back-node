import { KnexInstance } from '@config/index';
import { ClassController } from '@controllers/index';
import { Class, Discipline, Frequency, Schedule, User } from '@database/accessors';
import { RoleMiddlewares } from '@middlewares/index';
import { ClassService } from '@services/index';
import { Handler, Router } from 'express';

export const classRoutes = (roleMiddlewares: RoleMiddlewares) => {
  const router = Router();

  const { isAdmin } = roleMiddlewares;
  const classService = new ClassService(
    new Class(KnexInstance),
    new Discipline(KnexInstance),
    new Schedule(KnexInstance),
    new User(KnexInstance),
    new Frequency(KnexInstance)
  );

  const {
    index,
    store,
    show,
    delete: deleteFn,
    update,
    setDisciplinesToClass,
    unsetDisciplineToClass,
    getActiveClassWithDisciplines,
    setScheduleToClassByDiscipline,
    getClassSchedules,
    setUsersToClass,
    getClassWithDetails,
    getClassDisciplineDetails,
    getDisciplineScheduleFrequencies,
  } = new ClassController(classService);

  // Basic Class Entity CRUD

  router.get('/', (isAdmin as unknown) as Handler, (index as unknown) as Handler);

  router.get('/:class_guid', (show as unknown) as Handler);

  router.patch('/:class_guid', (isAdmin as unknown) as Handler, (update as unknown) as Handler);

  router.delete('/:class_guid', (isAdmin as unknown) as Handler, (deleteFn as unknown) as Handler);

  router.post('/', (isAdmin as unknown) as Handler, (store as unknown) as Handler);

  // Advanced functionalities

  router.post('/:class_guid/disciplines', (isAdmin as unknown) as Handler, setDisciplinesToClass);

  router.delete(
    '/:class_guid/disciplines/:discipline_guid',
    (isAdmin as unknown) as Handler,
    unsetDisciplineToClass
  );

  router.get('/:class_guid/disciplines', getActiveClassWithDisciplines);

  router.post(
    '/schedules',
    (isAdmin as unknown) as Handler,
    (setScheduleToClassByDiscipline as unknown) as Handler
  );

  router.get('/:class_guid/schedules', getClassSchedules);

  router.post('/:class_guid/users', (isAdmin as unknown) as Handler, setUsersToClass);

  router.get('/:class_guid/details', getClassWithDetails);

  router.get('/:class_guid/discipline/:discipline_guid', getClassDisciplineDetails);

  router.get(
    '/frequency/:class_has_discipline_has_schedule_guid',
    getDisciplineScheduleFrequencies
  );

  return router;
};
