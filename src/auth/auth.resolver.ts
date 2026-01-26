// import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import { AuthService } from './auth.service';
// import { LoginInput, RegisterInput } from './dto/graphql.inputs';
// import { AuthResponse } from './dto/graphql.types';

// @Resolver()
// export class AuthResolver {
//   constructor(private readonly authService: AuthService) {}

//   @Mutation(() => AuthResponse)
//   async register(
//     @Args('registerInput') registerInput: RegisterInput,
//   ): Promise<AuthResponse> {
//     return this.authService.register(registerInput);
//   }

//   @Mutation(() => AuthResponse)
//   async login(
//     @Args('loginInput') loginInput: LoginInput,
//   ): Promise<AuthResponse> {
//     return this.authService.login(loginInput);
//   }
// }


import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './dto/graphql.inputs';
import { AuthResponse, UserType } from './dto/graphql.types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // Add at least one query
  @Query(() => String)
  hello(): string {
    return 'Hello from GraphQL API!';
  }

  @Mutation(() => AuthResponse)
  async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }
}