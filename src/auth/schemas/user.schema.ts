import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender } from '../dto/graphql.enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  terms: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop() // Remove required to make it optional
  otp?: string;

  @Prop() // Remove required to make it optional
  otpExpires?: Date;

  @Prop({ default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
