import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ExampleTask {
  private readonly logger = new Logger(ExampleTask.name);

  /**
   * Example background job that runs every minute
   */
  @Cron(CronExpression.EVERY_MINUTE)
  handleEveryMinute() {
    this.logger.log('Background job running every minute...');
  }

  /**
   * Example job that runs every day at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleDailyCleanup() {
    this.logger.log('Daily cleanup task running...');
  }
}
