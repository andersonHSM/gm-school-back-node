import { BaseController } from "@models/index";
import { Request, Response } from "express";

export class AuthController implements BaseController {
  store() {
    throw new Error("Method not implemented.");
  }
  delete() {
    throw new Error("Method not implemented.");
  }
  update() {
    throw new Error("Method not implemented.");
  }
  show(_req: Request, res: Response): void {
    res.status(200).send("OK");
  }
  index() {
    throw new Error("Method not implemented.");
  }
}
