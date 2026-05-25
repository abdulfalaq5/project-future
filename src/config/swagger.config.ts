import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);

  const swaggerEnabled = configService.get<boolean>('app.swagger.enabled');
  const swaggerPath =
    configService.get<string>('app.swagger.path') || 'api/docs';
  const appName = configService.get<string>('app.name') || 'ECG LMS API';
  const appVersion = configService.get<string>('app.version') || '1.0.0';

  if (!swaggerEnabled) return;

  const config = new DocumentBuilder()
    .setTitle(`${appName}`)
    .setDescription(
      `
## ECG Learning Management System — API Documentation

Dokumentasi lengkap REST API untuk platform LMS ECG.

### Base URL
- **Development**: \`http://localhost:3000\`

### Authentication
API menggunakan JWT Bearer token untuk autentikasi (akan diimplementasikan di Phase 2).

### Response Format
Semua response menggunakan format standar:
\`\`\`json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": {...},
  "meta": null
}
\`\`\`
      `,
    )
    .setVersion(appVersion)
    .addTag('Health', 'Endpoint untuk health check aplikasi')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .setContact('ECG Dev Team', 'https://ecg.id', 'dev@ecg.id')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: `${appName} — API Docs`,
    customCss: `
      .swagger-ui .topbar { background-color: #1a1a2e; }
      .swagger-ui .topbar-wrapper .link { display: flex; align-items: center; }
      .swagger-ui .info .title { color: #16213e; font-weight: 700; }
    `,
  });

  console.log(
    `Swagger running at: http://localhost:${configService.get('app.port') || 3000}/${swaggerPath}`,
  );
}
