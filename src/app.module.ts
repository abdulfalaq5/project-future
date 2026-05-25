import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './modules/health/health.module';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    // ─────────────────────────────────────────
    // Configuration — must be first
    // ─────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
      envFilePath: ['.env'],
    }),

    // ─────────────────────────────────────────
    // Database
    // ─────────────────────────────────────────
    PrismaModule,

    // ─────────────────────────────────────────
    // Feature Modules
    // ─────────────────────────────────────────
    HealthModule,

    // ─────────────────────────────────────────
    // Future modules will be added here:
    // AuthModule, UserModule, CourseModule, etc.
    // ─────────────────────────────────────────
  ],
})
export class AppModule {}
