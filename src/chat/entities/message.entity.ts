import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => Chat, c => c.messages, { onDelete: 'CASCADE' })
  @Field(() => Chat)
  chat: Chat;

  @Column()
  @Field()
  senderType: 'user' | 'gallery';

  @Column()
  @Field()
  senderId: string;

  @Column('text')
  @Field(() => String)
  text: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @CreateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
