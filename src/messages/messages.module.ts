import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './message.model';
import { Subscription } from '../subscriptions/subscription.model';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Module({
  imports: [SequelizeModule.forFeature([Message, Subscription])],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway, SubscriptionsService],
})
export class MessagesModule {}
