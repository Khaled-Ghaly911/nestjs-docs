import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity'; 
import { PaginationInput } from 'src/common/pagination/pagination-input';
import { PageInfo } from '../common/pagination/page-info.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = this.repo.create(createUserDto);
    return user;
  }

  async findAll(args: PaginationInput): Promise<{ items: User[]; pageInfo: PageInfo }> {
    const { skip, take, filter, order } = args;
    const qb = this.repo.createQueryBuilder('user');

    if (filter) {
      qb.where('user.firstName ILIKE :f OR user.email ILIKE :f', { f: `%${filter}%` });
    }

    if (order) {
      qb.orderBy(`user.${order.field}`, order.direction);
    }

    qb.skip(skip).take(take + 1);
    const rows = await qb.getMany();

    const hasNextPage = rows.length > take;
    const items = rows.slice(0, take);
    const hasPreviousPage = skip > 0;

    return {
      items,
      pageInfo: { hasNextPage, hasPreviousPage },
    };
  }
}
