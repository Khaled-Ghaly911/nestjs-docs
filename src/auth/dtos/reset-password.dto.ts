//input: email, newPasswor, otp

import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

@InputType()
export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(50)
    @Field()
    newPassword: string;

    @IsNotEmpty()
    @Field()
    otp: string;
}