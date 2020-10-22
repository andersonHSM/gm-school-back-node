import Knex from 'knex';

class AddressService {
  constructor(private readonly knex: Knex) {}
}

export { AddressService };
