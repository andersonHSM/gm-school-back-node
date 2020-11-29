import { HttpException } from '@exceptions/';
import { BaseController } from '@models/';
import { InsertFrequencyPayload } from '@models/requests/frequency';
import { FrequencyService } from '@services/';
import { Request, Response } from 'express';

export class FrequencyController implements BaseController {
  constructor(private readonly frequencyService: FrequencyService) {}

  index(...args: any[]) {
    throw new Error('Method not implemented.');
  }
  store = async (req: Request<null, null, InsertFrequencyPayload>, res: Response) => {
    const { body: payload } = req;

    try {
      const frequency = await this.frequencyService.insertFrequency(payload);

      return res.status(201).json(frequency);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error?.message);
    }
  };
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
