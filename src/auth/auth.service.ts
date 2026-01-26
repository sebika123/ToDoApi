import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { EmailService } from 'src/email/email.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user already exists
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Email already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Generate OTP
    const otp = this.generateOTP();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + this.OTP_EXPIRY_MINUTES);

    // Create user (not verified yet)
    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires,
      role: 'user',
    });
    this.logger.log(
      `📧 Registration OTP for ${user.name} (${user.email}): ${otp}`,
    );
    this.logger.log(`⏰ OTP expires at: ${otpExpires}`);

    try {
      await this.emailService.sendVerificationEmail(user.email, otp, user.name);
    } catch (error) {
      // In development, continue even if email fails
      this.logger.warn(
        'Email sending failed, but continuing in development mode',
      );
    }

    // Return response without token (user needs to verify first)
    return {
      message:
        'Registration successful! Please check your email for verification OTP.',
      userId: user._id,
      email: user.email,
      isVerified: false,
      otpExpires: otpExpires,
      otp: otp, // Include OTP in response for testing
    };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Check if OTP exists and matches
    if (!user.otp || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check if OTP is expired
    if (!user.otpExpires || new Date() > user.otpExpires) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark user as verified and clear OTP using Mongoose update
    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { isVerified: true },
      $unset: { otp: '', otpExpires: '' },
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    // Get updated user
    const updatedUser = await this.userModel.findById(user._id);
    if (!updatedUser) {
      throw new NotFoundException('User not found after verification');
    }

    // Generate tokens
    const tokens = this.signToken(updatedUser);

    return {
      message: 'Email verified successfully!',
      ...tokens,
    };
  }

  async resendOtp(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new OTP
    const otp = this.generateOTP();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + this.OTP_EXPIRY_MINUTES);

    // Update user with new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Resend verification email
    await this.emailService.sendVerificationEmail(user.email, otp, user.name);

    return {
      message: 'New OTP sent to your email',
      otpExpires: otpExpires,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Check if user is verified
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user);
  }

  private generateOTP(): string {
    // Generate 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private signToken(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }
}
