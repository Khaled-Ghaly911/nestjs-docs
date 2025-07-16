import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer() io: Server;

  constructor(private chatService: ChatService) {}

  // 5.1 Client tells us "I want to join chat X"
  @SubscribeMessage('joinChat')
  async onJoin(
    @MessageBody() { chatId, userType, userId }: { chatId: string; userType: 'user'|'gallery'; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Optionally verify session or token here
    client.join(`chat:${chatId}`);
  }

  // 5.2 Client sends a new message
  @SubscribeMessage('sendMessage')
  async onSend(
    @MessageBody() { chatId, senderType, senderId, text }: { chatId: string; senderType: 'user'|'gallery'; senderId: string; text: string },
  ) {
    const msg = await this.chatService.createMessage(chatId, senderType, senderId, text);
    // Broadcast to everyone in room
    this.io.to(`chat:${chatId}`).emit('newMessage', msg);
  }
}
