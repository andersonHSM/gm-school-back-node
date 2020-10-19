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

  createToken(user_guid: string) {
    const { jwtExpiresIn, jwtSecurePassword } = this._config;
    const token = jwt.sign({ user_guid }, jwtSecurePassword, { expiresIn: jwtExpiresIn });

    return token;
  }
}
