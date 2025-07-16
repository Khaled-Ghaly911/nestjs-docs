// src/chat/chat.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chats: Repository<Chat>,
    @InjectRepository(Message) private messages: Repository<Message>,
  ) {}

  async getOrCreateChat(userId: string, galleryId: string): Promise<Chat> {
    if (userId === galleryId) {
      throw new BadRequestException(`userId and galleryId must differ`);
    }
    let chat = await this.chats.findOne({ where: { userId, galleryId } });
    if (!chat) {
      chat = this.chats.create({ userId, galleryId });
      await this.chats.save(chat);
    }
    return chat;
  }

  async createMessage(
    chatId: string,
    senderType: 'user' | 'gallery',
    senderId: string,
    text: string,
  ): Promise<Message> {
    const chat = await this.chats.findOne({ where: { id: chatId } });
    if (!chat) throw new BadRequestException('Chat not found');
    // Verify sender is participant
    if (!((senderType === 'user' && chat.userId === senderId) ||
          (senderType === 'gallery' && chat.galleryId === senderId))) {
      throw new BadRequestException('Sender not in this chat');
    }
    const msg = this.messages.create({ chat, senderType, senderId, text });
    return this.messages.save(msg);
  }
}
