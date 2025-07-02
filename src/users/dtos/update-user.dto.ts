import { Field, InputType } from "@nestjs/graphql";
import { Roles } from "../enum/role.enum";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    @Field({ nullable: true })
    email: string;

    @IsString()
    @MaxLength(75)
    @MinLength(3)
    @IsOptional()
    @Field({ nullable: true })
    firstName: string;

    @IsString()
    @MaxLength(75)
    @MinLength(3)
    @IsOptional()    
    @Field({ nullable: true })
    lastName: string;

    @IsString()
    @MaxLength(11)
    @MinLength(11)
    @IsOptional()    
    @Field({ nullable: true })
    phone: string;

    @IsString()
    @MaxLength(50)
    @MinLength(8)
    @IsOptional()    
    @Field({ nullable: true })
    password: string;

    @IsOptional()
    @Field(() => Roles,{ nullable: true })
    role: Roles;
}