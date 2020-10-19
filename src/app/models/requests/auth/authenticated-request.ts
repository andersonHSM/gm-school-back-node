import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user_guid: string;
}

export { AuthenticatedRequest };
