import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/user.entity'; 

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => User)
  user: User;
}