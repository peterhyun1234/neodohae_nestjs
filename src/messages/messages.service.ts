import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './message.model';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message)
    private messageModel: typeof Message,
  ) {}

  async create(createMessageDto: {
    senderId: number;
    roomId: number;
    content: string;
  }): Promise<Message> {
    const message = new Message();
    message.content = createMessageDto.content;
    message.senderId = createMessageDto.senderId;
    message.roomId = createMessageDto.roomId;
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
