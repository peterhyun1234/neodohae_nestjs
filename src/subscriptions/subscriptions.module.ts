import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscription } from './subscription.model';
import { SubscriptionController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [SequelizeModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
