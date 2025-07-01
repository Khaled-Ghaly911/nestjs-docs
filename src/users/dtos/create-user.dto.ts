import { Field, InputType } from "@nestjs/graphql";
import { Roles } from "../enum/role.enum";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;

    @IsString()
    @MaxLength(75)
    @MinLength(3)
    @IsNotEmpty()
    @Field()
    firstName: string;

    @IsString()
    @MaxLength(75)
    @MinLength(3)
    @IsNotEmpty()   
    @Field() 
    lastName: string;

    @IsString()
    @MaxLength(11)
    @MinLength(11)
    @IsNotEmpty()    
    @Field()
    phone: string;

    @IsString()
    @MaxLength(50)
    @MinLength(8)
    @IsNotEmpty()    
    @Field()
    password: string;

    @IsNotEmpty()
    @Field(() => Roles)
    role: Roles;
}