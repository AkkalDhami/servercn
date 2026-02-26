import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ExampleTask } from './example.task';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ExampleTask],
})
export class CronModule {}
