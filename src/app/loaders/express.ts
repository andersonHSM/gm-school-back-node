import express, { json, Request, Response } from "express";
import cors from "cors";

export default async (app: express.Application) => {
  app.use(cors());
  app.use(json());

  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World!" });
  });

  return app;
};
