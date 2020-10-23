import { Handler, Router } from 'express';
import { AddressService } from '@services/index';

import { KnexInstance } from '@config/index';
import { AddressController } from '@controllers/address-conrtoller';
import { Address } from '@database/accessors';

const router = Router();

const addressService = new AddressService(new Address(KnexInstance));

const { index, store, update, delete: controllerDeleteFn, show } = new AddressController(
  addressService
);

router.get('/', (index as unknown) as Handler);

router.post('/', (store as unknown) as Handler);

router.get('/:address_guid', (show as unknown) as Handler);

router.patch('/:address_guid', (update as unknown) as Handler);

router.delete('/:address_guid', (controllerDeleteFn as unknown) as Handler);

export default router;
