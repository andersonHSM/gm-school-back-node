import express, { json, Request, Response } from "express";
import cors from "cors";

import { authRoutes } from "@routes/index";

export default async (app: express.Application) => {
  const router = express.Router();

  app.use(cors());
  app.use(json());

  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World!" });
  });

  app.use("/auth", authRoutes(router));

  return app;
};
