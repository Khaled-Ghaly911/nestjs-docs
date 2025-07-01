// src/users/dto/paginated-users.dto.ts
import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from '../../common/pagination/paginated-response';
import { User } from '../user.entity';

@ObjectType()
export class PaginatedUsers extends PaginatedResponse(User) {}
