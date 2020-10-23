import { Handler, Router } from 'express';
import { AddressService } from '@services/index';

import { KnexInstance } from '@config/index';
import { AddressController } from '@controllers/address-conrtoller';
import { Address } from '@database/accessors';

const router = Router();

const addressService = new AddressService(new Address(KnexInstance));

const { index, store } = new AddressController(addressService);

router.get('/', (index as unknown) as Handler);

router.post('/', (store as unknown) as Handler);

export default router;
