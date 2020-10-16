interface EnvConfig {
  port: string;
  dbPort: number;
  dbClient: string;
  dbUser: string;
  dbHost: string;
  dbPassword: string;
  dbName: string;
  jwtSecurePassword: string;
  jwtExpiresIn: number;
}

export { EnvConfig };
