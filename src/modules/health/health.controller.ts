import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  @Get()
  @ApiOperation({
    summary: 'Health Check',
    description: 'Cek status aplikasi berjalan dengan baik',
  })
  @ApiResponse({
    status: 200,
    description: 'API berjalan normal',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'API running',
        data: {
          status: 'ok',
          timestamp: '2024-01-01T00:00:00.000Z',
          uptime: 12345,
          environment: 'development',
          version: '1.0.0',
        },
        meta: null,
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  check() {
    return {
      success: true,
      statusCode: 200,
      message: 'API running',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - this.startTime) / 1000),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0',
      },
      meta: null,
      timestamp: new Date().toISOString(),
    };
  }
}
