import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './message.model';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectModel(Message)
    private messageModel: typeof Message,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly usersService: UsersService,
  ) {}

  async create(creatingMessage: {
    senderId: number;
    roomId: number;
    content: string;
  }): Promise<Message> {
    try {
      this.logger.log(`Creating message: ${JSON.stringify(creatingMessage)}`);

      const content = creatingMessage.content;
      const userId = creatingMessage.senderId;
      const user = await this.usersService.findOne(userId);
      const roomId = creatingMessage.roomId;

      const roomUsers = await this.usersService.findAllByRoomId(roomId);
      const userIds = roomUsers.map((user) => user.id);
      const limitedContent =
        content.length > 20 ? content.substring(0, 20) + '...' : content;
      userIds.forEach((id) => {
        if (id === userId) return;
        const payload = {
          title: `너도해 채팅`,
          body: `${user.username}: ${limitedContent}`,
        };
        this.subscriptionsService.sendNotificationToUser(id, payload, true);
      });

      const message = new Message();
      message.content = content;
      message.senderId = userId;
      message.roomId = roomId;
      const savedMessage = await message.save();

      this.logger.log(`Created message: ${JSON.stringify(savedMessage)}`);
      return savedMessage;
    } catch (error) {
      this.logger.error(
        `Failed to create message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<Message[]> {
    try {
      this.logger.log('Finding all messages');
      return this.messageModel.findAll();
    } catch (error) {
      this.logger.error(
        `Failed to find all messages: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOneById(id: number): Promise<Message> {
    try {
      this.logger.log(`Finding message with id: ${id}`);
      return this.messageModel.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Failed to find message with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOneByRoomId(roomId: number): Promise<Message[]> {
    try {
      this.logger.log(`Finding messages with roomId: ${roomId}`);

      const messages = await this.messageModel.findAll({ where: { roomId } });
      if (!messages) {
        throw new NotFoundException(`Messages with roomId ${roomId} not found`);
      }
      return messages;
    } catch (error) {
      this.logger.error(
        `Failed to find messages with roomId ${roomId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.log(`Removing message with id: ${id}`);

      const message = await this.findOneById(id);
      await message.destroy();

      this.logger.log(`Removed message with id: ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to remove message with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
