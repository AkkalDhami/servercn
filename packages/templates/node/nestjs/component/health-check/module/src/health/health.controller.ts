import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  /**
   * Basic health check
   * GET /health
   */
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }

  /**
   * Detailed health check with system metrics
   * GET /health/detailed
   */
  @Get('detailed')
  @HealthCheck()
  checkDetailed() {
    return this.health.check([
      // Heap should not use more than 150 MB
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // RSS should not exceed 300 MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      // Storage should not exceed 90% usage
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }
}
