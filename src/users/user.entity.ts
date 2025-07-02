import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Roles } from "./enum/role.enum";
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

    @Column({ type: 'enum', enum: Roles, default: Roles.USER })
    @Field(() => Roles, { defaultValue: Roles.USER, nullable: true })
    role: Roles;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @UpdateDateColumn()
    @Field(() => Date)
    updatedAt: Date;
}
