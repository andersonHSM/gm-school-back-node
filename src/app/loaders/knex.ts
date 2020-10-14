import Knex from 'knex';
import Config from '@config/index';

export default () => {
  return Knex({
    client: Config.dbClient,
    connection: {
      host: Config.dbHost ?? '0.0.0.0',
      port: Config.dbPort ?? 3010,
      user: Config.dbUser ?? 'root',
      password: Config.dbPassword ?? '123456',
    },
  });
};
