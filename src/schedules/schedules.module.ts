import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Schedule } from './schedule.model';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { Subscription } from '../subscriptions/subscription.model';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Module({
  imports: [SequelizeModule.forFeature([Schedule, Subscription])],
  controllers: [SchedulesController],
  providers: [SchedulesService, SubscriptionsService],
})
export class SchedulesModule {}
