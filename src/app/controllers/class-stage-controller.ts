import { ClassStage } from '@database/accessors';
import { BaseController } from '@models/index';

export class ClassStageController implements BaseController {
  constructor(private readonly classStage: ClassStage) {}

  index() {
    throw new Error('Method not implemented.');
  }
  store() {
    throw new Error('Method not implemented.');
  }
  delete() {
    throw new Error('Method not implemented.');
  }
  update() {
    throw new Error('Method not implemented.');
  }
  show() {
    throw new Error('Method not implemented.');
  }
}
