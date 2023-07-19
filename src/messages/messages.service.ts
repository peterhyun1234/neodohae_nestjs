import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './message.model';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
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
    return message.save();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.findAll();
  }

  async findOneById(id: number): Promise<Message> {
    return this.messageModel.findOne({ where: { id } });
  }

  async findOneByRoomId(roomId: number): Promise<Message[]> {
    const messages = await this.messageModel.findAll({ where: { roomId } });
    if (!messages) {
      throw new NotFoundException(`Messages with roomId ${roomId} not found`);
    }
    return messages;
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOneById(id);
    await message.destroy();
  }
}
