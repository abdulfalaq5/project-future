import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const nodeEnv = configService.get<string>('app.nodeEnv') || 'development';
  const corsOrigins = configService.get<string[]>('app.corsOrigins') || ['*'];
  const appName = configService.get<string>('app.name') || 'ECG-LMS-API';
  const appVersion = configService.get<string>('app.version') || '1.0.0';

  // ─────────────────────────────────────────
  // Security
  // ─────────────────────────────────────────
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: nodeEnv === 'production',
    }),
  );

  // ─────────────────────────────────────────
  // CORS
  // ─────────────────────────────────────────
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // ─────────────────────────────────────────
  // Global Prefix
  // ─────────────────────────────────────────
  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  // ─────────────────────────────────────────
  // Global Validation Pipe
  // ─────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip unknown properties
      forbidNonWhitelisted: true, // Reject unknown properties
      transform: true,           // Auto-transform types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─────────────────────────────────────────
  // Global Exception Filter
  // ─────────────────────────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ─────────────────────────────────────────
  // Global Interceptors
  // ─────────────────────────────────────────
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  // ─────────────────────────────────────────
  // Swagger
  // ─────────────────────────────────────────
  setupSwagger(app);

  // ─────────────────────────────────────────
  // Graceful Shutdown
  // ─────────────────────────────────────────
  app.enableShutdownHooks();

  await app.listen(port);

  logger.log(`${appName} v${appVersion}`);
  logger.log(`Environment  : ${nodeEnv}`);
  logger.log(`Server       : http://localhost:${port}`);
  logger.log(`Health       : http://localhost:${port}/health`);
  logger.log(`Swagger      : http://localhost:${port}/api/docs`);
}

bootstrap();
