import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: 'Pagination metadata for cursors or offset paging' })
export class PageInfo {
  @Field({ description: 'Is there a next page?' })
  hasNextPage: boolean;

  @Field({ description: 'Is there a previous page?' })
  hasPreviousPage: boolean;

  @Field(() => Number, { nullable: true, description: 'Total count (optional)' })
  totalCount?: number;
}
