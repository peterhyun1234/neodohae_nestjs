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

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any): Promise<void> {
    const message = await this.messagesService.create(payload);
    this.server.emit('newMessage', message);
  }

  @SubscribeMessage('delete')
  async handleMessageDelete(client: any, payload: any): Promise<void> {
    await this.messagesService.remove(payload.id);
    this.server.emit('messageDeleted', payload.id);
  }
}
