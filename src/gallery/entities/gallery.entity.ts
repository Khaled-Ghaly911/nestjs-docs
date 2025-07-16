import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Chat } from 'src/chat/entities/chat.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isVerified: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  // Relations
  @OneToMany(() => Chat, chat => chat.gallery)
  @Field(() => [Chat], { nullable: true })
  chats: Chat[];
}
