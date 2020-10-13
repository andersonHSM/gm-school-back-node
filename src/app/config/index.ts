export default {
  port: process.env.PORT,
  dbPort: process.env.DB_PORT as number | undefined,
  dbClient: process.env.DB_CLIENT,
  dbUser: process.env.DB_USER,
  dbHost: process.env.DB_HOST,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
};
