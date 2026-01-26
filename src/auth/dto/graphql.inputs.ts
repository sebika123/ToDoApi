import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Gender } from './graphql.enums';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Field()
  @IsString()
  phone: string;

  @Field()
  @IsString()
  address: string;

  @Field()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field(() => Gender)
  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender: Gender;

  @Field()
  @MinLength(6)
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Field()
  @IsBoolean()
  @IsNotEmpty({ message: 'You must accept terms and conditions' })
  terms: boolean;
}
