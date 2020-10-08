import { init as Loaders } from "@loaders/index";
import Config from "@config/index";

import express from "express";

const startServer = async () => {
  const app = express();

  await Loaders(app);

  app.listen(Config.port, () => {});
};

export default startServer;
