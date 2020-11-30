import { HttpException } from '@exceptions/http-exception';

export const frequencyNotFoundException = () => new HttpException('Frequency not found', 1402, 404);
