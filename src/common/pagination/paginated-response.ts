import { ObjectType, Field } from '@nestjs/graphql';
import { PageInfo } from './page-info.dto';
import { Type } from '@nestjs/common';

export function PaginatedResponse<TItem>(ItemClass: Type<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [ItemClass], { description: 'List of items on this page' })
    items: TItem[];

    @Field(() => PageInfo, { description: 'Pagination metadata' })
    pageInfo: PageInfo;
  }
  return PaginatedType;
}
