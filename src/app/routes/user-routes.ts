import { AuthenticatedRequest } from '@models/requests/auth';
import { Router, Handler, Response } from 'express';

export const userRoutes = (router: Router): Router => {
  router.get('/', (function (req: AuthenticatedRequest, res: Response) {
    console.log(req.user_guid, res);
  } as unknown) as Handler);

  return router;
};
