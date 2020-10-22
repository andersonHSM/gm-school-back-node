import { Handler, Router } from 'express';
import { AddressService } from '@services/index';

import { KnexInstance } from '@config/index';
import { AddressController } from '@controllers/address-conrtoller';

export const addressRoutes = (router: Router): Router => {
  const addressService = new AddressService(KnexInstance);

  const { index, store } = new AddressController(addressService);

  router.get('/', (index as unknown) as Handler);

  router.post('/signup', store);

  return router;
};
