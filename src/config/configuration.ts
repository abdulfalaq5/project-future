import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  name: process.env.APP_NAME || 'ECG-LMS-API',
  version: process.env.APP_VERSION || '1.0.0',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    path: process.env.SWAGGER_PATH || 'api/docs',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
}));
