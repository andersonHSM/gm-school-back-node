import Knex from 'knex';
import { EnviromentConfig } from '@config/index';

export default () => {
  return Knex({
    client: EnviromentConfig.dbClient,
    connection: {
      host: EnviromentConfig.dbHost ?? '0.0.0.0',
      port: EnviromentConfig.dbPort ?? 3010,
      user: EnviromentConfig.dbUser ?? 'root',
      password: EnviromentConfig.dbPassword ?? '123456',
    },
  });
};
