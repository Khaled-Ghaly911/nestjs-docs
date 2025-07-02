import { InputType } from "@nestjs/graphql";
import { CreateUserDto } from "src/users/dtos/create-user.dto";

@InputType()
export class SignupDto extends CreateUserDto {}