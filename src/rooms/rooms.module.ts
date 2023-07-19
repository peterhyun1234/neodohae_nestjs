import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './room.model';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { Subscription } from '../subscriptions/subscription.model';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Module({
  imports: [SequelizeModule.forFeature([Room, User, Subscription])],
  controllers: [RoomsController],
  providers: [RoomsService, UsersService, SubscriptionsService],
})
export class RoomsModule {}
