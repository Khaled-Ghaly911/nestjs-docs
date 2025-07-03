import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Role } from "./enum/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column({ unique: true })
    @Field()
    email: string;

    @Column()
    @Field()
    firstName: string;

    @Column()
    @Field()
    lastName: string;

    @Column()
    @Field()
    phone: string;

    @Column()
    @Field()
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    @Field(() => Role, { defaultValue: Role.USER, nullable: true })
    role: Role;

    @Column({ default: false })
    @Field(() => Boolean, { nullable: true, defaultValue: false })
    isVerified: boolean;
    
    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @UpdateDateColumn()
    @Field(() => Date)
    updatedAt: Date;
}
