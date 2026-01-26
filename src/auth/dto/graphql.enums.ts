import { registerEnumType } from '@nestjs/graphql';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// Register enum with GraphQL
registerEnumType(Gender, {
  name: 'Gender',
  description: 'User gender',
});
