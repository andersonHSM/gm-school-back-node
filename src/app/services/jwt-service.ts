import jwt from 'jsonwebtoken';

import { EnvConfig } from '@models/index';

export class JwtService {
  private _config: EnvConfig;

  constructor(config: EnvConfig) {
    this._config = config;
  }

  validateToken(token: string) {
    const { jwtSecurePassword } = this._config;

    return jwt.verify(token, jwtSecurePassword);
  }

  createToken(userId: number) {
    const { jwtExpiresIn, jwtSecurePassword } = this._config;
    const token = jwt.sign({ userId }, jwtSecurePassword, { expiresIn: jwtExpiresIn });

    return token;
  }
}
