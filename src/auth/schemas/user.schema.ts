import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Gender } from '../dto/graphql.enums';

@ObjectType()
@Schema({ timestamps: true })
export class User extends Document {
  @Field(() => ID)
  declare id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop()
  phone: string;

  @Field()
  @Prop()
  address: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field(() => Gender)
  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  terms: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add a transform to map _id to id
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});
