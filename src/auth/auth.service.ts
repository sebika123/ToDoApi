import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { RegisterInput } from './dto/graphql.inputs';
import { LoginDto } from './dto/login.dto';



@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerData: RegisterDto | RegisterInput): Promise<any> {
    // Check if user exists
    const existingUser = await this.userModel.findOne({
      email: registerData.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    // Create user
    const user = await this.userModel.create({
      name: registerData.name,
      email: registerData.email,
      password: hashedPassword,
      phone: registerData.phone,
      address: registerData.address,
      gender: registerData.gender,
      terms: registerData.terms,
    });

    // Generate JWT token
    const token = this.jwtService.sign({ sub: user._id, email: user.email });

    // Convert to JSON to get transformed fields
    const userJson = user.toJSON();

    return {
      access_token: token,
      message: 'User registered successfully',
      success: true,
      user: {
        id: userJson.id,
        name: userJson.name,
        email: userJson.email,
        phone: userJson.phone,
        address: userJson.address,
        gender: userJson.gender,
        createdAt: userJson.createdAt,
        updatedAt: userJson.updatedAt,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ sub: user._id, email: user.email });

    // Convert to JSON to get transformed fields
    const userJson = user.toJSON();

    return {
      access_token: token,
      message: 'Login successful',
      success: true,
      user: {
        id: userJson.id,
        name: userJson.name,
        email: userJson.email,
        phone: userJson.phone,
        address: userJson.address,
        gender: userJson.gender,
        createdAt: userJson.createdAt,
        updatedAt: userJson.updatedAt,
      },
    };
  }
}
