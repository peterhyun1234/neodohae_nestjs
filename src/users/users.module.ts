import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Subscription } from '../subscriptions/subscription.model';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Subscription])],
  controllers: [UsersController],
  providers: [UsersService, SubscriptionsService],
})
export class UsersModule {}
