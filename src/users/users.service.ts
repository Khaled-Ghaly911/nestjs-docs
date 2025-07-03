import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity'; 
import { PaginationInput } from 'src/common/pagination/pagination-input';
import { PageInfo } from '../common/pagination/page-info.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = this.repo.create(createUserDto);
    return this.repo.save(user);
  }

  // async createMany(createUserDto: CreateUserDto[]): Promise<User[]> {
  //   const users: User[] = this.repo.create(createUserDto);
  //   return this.repo.save(users);
  // }

  async findAll(args: PaginationInput): Promise<{ items: User[]; pageInfo: PageInfo }> {
    const { skip, take, filter, order } = args;
    const qb = this.repo.createQueryBuilder('user');

    if (filter) {
      qb.where(
        '(user.firstName ILIKE :f OR user.lastName ILIKE :f OR user.email ILIKE :f)',
        { f: `%${filter}%` }
      );
    }
    

    const safeFields = ['firstName','lastName','email','createdAt'];
    if (order && safeFields.includes(order.field)) {
      qb.orderBy(`user.${order.field}`, order.direction);
    }


    qb.skip(skip).take(take + 1);
    const rows = await qb.getMany();

    const hasNextPage = rows.length > take;
    const items = rows.slice(0, take);
    const hasPreviousPage = skip > 0;
    const totalCount = items.length

    return {
      items,
      pageInfo: { hasNextPage, hasPreviousPage, totalCount },
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if(!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOneBy({ email });
    return user;
  }

  async update(id: string, updateUserDto: Partial<UpdateUserDto>): Promise<User> {
    const user: User = await this.findById(id);
    await this.repo.update(id, updateUserDto);
    const updatedUser = await this.findById(id);
    return updatedUser;
  }

  async delete(id: string): Promise<User> { 
    // find the user first
    const user = await this.findById(id);
    
    await this.repo.delete(id);
    return user;
  }
}
