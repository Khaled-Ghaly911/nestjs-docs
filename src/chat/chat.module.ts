import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { ChatService } from './chat.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat, Message]),
    ],
    providers: [ChatService],
    exports: [],
})
export class ChatModule {}
