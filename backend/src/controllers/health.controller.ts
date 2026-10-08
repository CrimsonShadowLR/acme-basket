import { Controller, Get } from '@nestjs/common';

/** Liveness probe for the Docker healthcheck and the frontend status badge. */
@Controller('healthcheck')
export class HealthController {
  @Get()
  check(): { status: 'ok' } {
    return { status: 'ok' };
  }
}
