import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Check,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Gallery } from 'src/gallery/entities/gallery.entity';
import { Message } from './message.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@Check(`"userId" <> "galleryId"`)
@ObjectType()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  userId: string;

  @Column()
  @Field(() => String)
  galleryId: string;

  @ManyToOne(() => User, u => u.chats)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Gallery, g => g.chats)
  @Field(() => Gallery)
  gallery: Gallery;

  @OneToMany(() => Message, message => message.chat)
  @Field(() => [Message])
  messages: Message[];
}
