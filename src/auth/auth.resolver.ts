import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import {
  AuthResponse,
  RegisterResponse,
  ResendOtpResponse,
  VerifyOtpResponse,
} from './auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  healthCheck(): string {
    return 'Auth service is running!';
  }

  @Mutation(() => RegisterResponse)
  async register(@Args('input') dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Mutation(() => VerifyOtpResponse)
  async verifyOtp(@Args('input') dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

  @Mutation(() => ResendOtpResponse)
  async resendOtp(@Args('input') dto: ResendOtpDto) {
    return this.authService.resendOtp(dto.email);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
