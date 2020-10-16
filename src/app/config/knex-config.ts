import Knex from 'knex';

import knexFileConfig from '../../../knexfile';

const knex = Knex(knexFileConfig);

export { knex as KnexInstance };
