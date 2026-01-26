import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.setupTransporter();
  }

  private setupTransporter() {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASSWORD');

    this.logger.log(` Email User: ${emailUser ? 'Set' : 'Not set'}`);
    this.logger.log(`Email Pass: ${emailPass ? 'Set' : 'Not set'}`);

    if (!emailUser || !emailPass) {
      this.logger.warn('Using console mode for email');
      this.setupConsoleTransporter();
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
        port: this.configService.get<number>('EMAIL_PORT', 587),
        secure: false, // Use false for port 587
        requireTLS: true, // Add this
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates
          ciphers: 'SSLv3', // Try different cipher
        },
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        debug: true, // Enable debugging
      });

      // Test connection
      this.transporter.verify((error, success) => {
        if (error) {
          this.logger.error('SMTP Connection failed:', error.message);
          this.logger.warn('Falling back to console mode');
          this.setupConsoleTransporter();
        } else {
          this.logger.log('SMTP server is ready to send emails');
        }
      });
    } catch (error) {
      this.logger.error('Failed to setup transporter:', error.message);
      this.setupConsoleTransporter();
    }
  }

  private setupConsoleTransporter() {
    this.transporter = {
      sendMail: (mailOptions) => {
        const otp = this.extractOTPFromHtml(mailOptions.html as string);

        return Promise.resolve({
          messageId: `dev-${Date.now()}`,
        });
      },
    } as any;

    this.logger.log(' Using console email transporter (development mode)');
  }

  private extractOTPFromHtml(html: string): string {
    const otpMatch = html.match(/\b(\d{6})\b/);
    return otpMatch ? otpMatch[1] : 'N/A';
  }

  async sendVerificationEmail(to: string, otp: string, name: string) {
    const mailOptions = {
      from: `"${this.configService.get<string>('EMAIL_FROM_NAME', 'Todo List')}" <${this.configService.get<string>('EMAIL_FROM', 'sebika.ebpearls@gmail.com')}>`,
      to,
      subject: 'Verify Your Email - Todo List App',
      html: this.generateVerificationHtml(name, otp),
      text: `Hello ${name},\n\nYour verification OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nBest regards,\nTodo List Team`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);

      return true;
    } catch (error) {
      this.logger.log(`OTP for ${name}: ${otp}`);
      return true; // Don't break registration
    }
  }

  private generateVerificationHtml(name: string, otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background-color: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .otp { font-size: 42px; font-weight: bold; color: #4F46E5; text-align: center; margin: 30px 0; letter-spacing: 10px; }
              .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1> Verify Your Email</h1>
              </div>
              <div class="content">
                  <p>Hello <strong>${name}</strong>,</p>
                  <p>Your verification OTP is:</p>
                  <div class="otp">${otp}</div>
                  <p>This OTP will expire in 10 minutes.</p>
                  <p>Best regards,<br>Todo List Team</p>
              </div>
              <div class="footer">
                  <p>This is an automated message.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(to: string, name: string) {
    this.logger.log(`Welcome email would be sent to: ${name} (${to})`);

    // Simple implementation
    const mailOptions = {
      from: `"${this.configService.get<string>('EMAIL_FROM_NAME', 'Todo List')}" <${this.configService.get<string>('EMAIL_FROM', 'sebika.ebpearls@gmail.com')}>`,
      to,
      subject: ' Welcome to Todo List!',
      text: `Hello ${name},\n\nYour account has been verified!\n\nWelcome to Todo List!`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to: ${to}`);
    } catch (error) {
      this.logger.log(`Welcome email would be sent to: ${to}`);
    }
  }
}
