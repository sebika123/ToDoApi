import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from './graphql.enums';

@InputType() // Add this - REQUIRED for GraphQL
export class RegisterDto {
  @Field() // Add this - REQUIRED for each GraphQL field
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Field({ nullable: true }) // Make optional
  @IsString()
  phone: string;

  @Field({ nullable: true }) // Make optional
  @IsString()
  address: string;

  @Field() // Add this
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field(() => Gender) // Add this - specify enum type
  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender: Gender;

  @Field() // Add this
  @MinLength(6)
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Field() // Add this
  @IsBoolean()
  @IsNotEmpty({ message: 'You must accept terms and conditions' })
  terms: boolean;
}