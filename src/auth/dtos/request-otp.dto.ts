import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

@InputType()
export class RequestOtpDto {
    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;

    @IsOptional()
    @Field({ nullable: true })
    name?: string;
}