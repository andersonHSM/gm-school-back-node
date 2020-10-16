import { init as Loaders } from '@loaders/index';
import { EnviromentConfig } from '@config/index';

import express from 'express';

const startServer = async () => {
  const app = express();

  await Loaders(app);

  app.listen(EnviromentConfig.port, () => {});
};

export default startServer;
