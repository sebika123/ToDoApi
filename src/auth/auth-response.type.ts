import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field()
  isVerified: boolean;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  message: string;

  @Field()
  userId: string;

  @Field()
  email: string;

  @Field()
  isVerified: boolean;

  @Field()
  otpExpires: Date;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => UserType)
  user: UserType;
}

@ObjectType()
export class VerifyOtpResponse {
  @Field()
  message: string;

  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => UserType)
  user: UserType;
}
