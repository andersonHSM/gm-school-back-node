import express from 'express';
import expressLoader from './express';
import knexLoader from './knex';

export const init = async (app: express.Application) => {
  knexLoader();
  await expressLoader(app);
};
