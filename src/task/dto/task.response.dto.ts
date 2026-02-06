import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TaskResponse {
  @Field()
  id: string;
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;
}
