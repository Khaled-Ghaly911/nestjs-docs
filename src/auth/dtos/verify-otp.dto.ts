import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

@InputType()
export class VerifyOtpDto {
    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;

    @IsNotEmpty()
    @Field()
    otp: string;
}