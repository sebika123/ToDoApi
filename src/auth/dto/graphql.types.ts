import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Gender } from './graphql.enums';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field(() => Gender)
  gender: Gender;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field(() => UserType)
  user: UserType;
}
