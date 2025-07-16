import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SortDirection } from 'src/users/enum/sortDirections.enum';

registerEnumType(SortDirection, { name: 'SortDirection' });

@InputType()
export class SortOptions {
  @Field(() => String, { description: 'Entity field to sort by' })
  @IsString()
  @IsNotEmpty()
  field: string;

  @Field(() => SortDirection, { description: 'Sort order' })
  @IsEnum(SortDirection)
  @IsNotEmpty()
  direction: SortDirection;
}
