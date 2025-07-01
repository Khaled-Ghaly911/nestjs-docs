import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity'; 
import { PaginationInput } from 'src/common/pagination/pagination-input'; 
import { PaginatedUsers } from './dtos/paginated-users.dto'; 
import { CreateUserDto } from './dtos/create-user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserDto') createUserDto: CreateUserDto): Promise<User>{
    return this.usersService.create(createUserDto);
  }

  @Query(() => PaginatedUsers, { name: 'users' })
  async users(@Args('paginationInput') paginationInput: PaginationInput) {
    return this.usersService.findAll(paginationInput);
  }

}
