import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsString()
  phone: string;
  @IsString()
  address: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender: Gender;
  @MinLength(6)
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'You must accept terms and conditions' })
  terms: boolean;
}
