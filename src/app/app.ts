import { init as Loaders } from '@loaders/';
import { EnviromentConfig } from '@config/';

import express from 'express';

const startServer = async () => {
  const app = express();

  await Loaders(app);

  app.listen(EnviromentConfig.port, () => {});
};

export default startServer;
