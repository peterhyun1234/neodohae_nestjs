import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: ['http://localhost:4100', 'https://neodohae.com'],
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private messagesService: MessagesService) {}

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(client: any, roomId: string): Promise<void> {
    client.join(roomId);
  }

  @SubscribeMessage('leaveRoom')
  async handleRoomLeave(client: any, roomId: string): Promise<void> {
    client.leave(roomId);
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any): Promise<void> {
    const { roomId } = payload;
    const message = await this.messagesService.create(payload);
    this.server.to(roomId).emit('newMessage', message);
  }

  @SubscribeMessage('delete')
  async handleMessageDelete(
    client: any,
    { roomId, messageId }: any,
  ): Promise<void> {
    await this.messagesService.remove(messageId);
    this.server.to(roomId).emit('messageDeleted', messageId);
  }
}
