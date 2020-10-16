import { EnvConfig } from '@models/index';

const EnviromentConfig: EnvConfig = {
  port: process.env.PORT!,
  dbPort: (process.env.DB_PORT! as unknown) as number,
  dbClient: process.env.DB_CLIENT!,
  dbUser: process.env.DB_USER!,
  dbHost: process.env.DB_HOST!,
  dbPassword: process.env.DB_PASSWORD!,
  dbName: process.env.DB_NAME!,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN! as unknown) as number,
  jwtSecurePassword: process.env.JWT_SECURE_PASSWORD!,
};

export { EnviromentConfig };
