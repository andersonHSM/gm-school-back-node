import { BaseController } from '@models/';
import { FrequencyService } from '@services/';

export class FrequencyController implements BaseController {
  constructor(private readonly frequencyService: FrequencyService) {}

  index(...args: any[]) {
    throw new Error('Method not implemented.');
  }
  store(...args: any[]) {
    throw new Error('Method not implemented.');
  }
  delete(...args: any[]) {
    throw new Error('Method not implemented.');
  }
  update(...args: any[]) {
    throw new Error('Method not implemented.');
  }
  show(...args: any[]) {
    throw new Error('Method not implemented.');
  }
}
