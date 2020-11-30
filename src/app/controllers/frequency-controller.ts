import { HttpException } from '@exceptions/';
import { BaseController } from '@models/';
import { FrequencyModel } from '@models/entities';
import { InsertFrequencyPayload } from '@models/requests/frequency';
import { FrequencyService } from '@services/';
import { Request, Response } from 'express';

export class FrequencyController implements BaseController {
  constructor(private readonly frequencyService: FrequencyService) {}

  index = async (req: Request, res: Response) => {
    try {
      const frequencies = await this.frequencyService.listFrequencies();

      return res.status(201).json(frequencies);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error?.message);
    }
  };

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

  delete = async (req: Request<{ frequency_guid: string }>, res: Response) => {
    const { frequency_guid } = req.params;

    try {
      const frequency = await this.frequencyService.deleteFrequency(frequency_guid);

      return res.status(201).json(frequency);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error?.message);
    }
  };

  update = async (
    req: Request<{ frequency_guid: string }, null, Pick<FrequencyModel, 'is_present'>>,
    res: Response
  ) => {
    const { frequency_guid } = req.params;
    const { body: payload } = req;

    try {
      const frequency = await this.frequencyService.updateFrequency(frequency_guid, payload);

      return res.status(201).json(frequency);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error?.message);
    }
  };

  show = async (req: Request<{ frequency_guid: string }>, res: Response) => {
    const { frequency_guid } = req.params;

    try {
      const frequency = await this.frequencyService.retrieveFrequency(frequency_guid);

      return res.status(201).json(frequency);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error.format());
      }

      return res.status(500).json(error?.message);
    }
  };
}
