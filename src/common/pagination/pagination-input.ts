// src/common/pagination/pagination-args.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SortOptions } from './sort-options';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 10, description: 'How many items to fetch (max 100)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take: number;

  @Field(() => Int, { defaultValue: 0, description: 'How many items to skip' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip: number;

  @Field(() => String, { nullable: true, description: 'Text to filter by (e.g. name or email)' })
  @IsOptional()
  @IsString()
  filter?: string;

  @Field(() => SortOptions, { nullable: true, description: 'Optional ordering' })
  @IsOptional()
  // @ValidateNested()
  order?: SortOptions;
}
