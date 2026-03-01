import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TwilioService } from '../twilio/twilio.service';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class VerifyService {
  private readonly logger = new Logger(VerifyService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly jwtService: JwtService,
    private readonly twilioService: TwilioService,
  ) {}

  async sendCode(phone: string): Promise<{ success: boolean }> {
    try {
      await this.twilioService.getVerifyService()
        .verifications.create({ to: phone, channel: 'sms' });

      this.logger.log(`OTP sent to ${phone}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${phone}: ${error.message}`);
      throw error;
    }
  }

  async verifyCode(phone: string, code: string): Promise<{ accessToken: string; refreshToken: string }> {
    const check = await this.twilioService.getVerifyService()
      .verificationChecks.create({ to: phone, code });

    if (check.status !== 'approved') {
      throw new UnauthorizedException('Invalid verification code');
    }

    // Find or create client
    let client = await this.clientRepository.findOne({ where: { phone } });
    if (!client) {
      client = this.clientRepository.create({ phone });
      client = await this.clientRepository.save(client);
      this.logger.log(`New client created: ${client.id} (${phone})`);
    }

    // Read role from the database
    const payload = { sub: client.id, phone: client.phone, role: client.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(token: string): Promise<{ accessToken: string }> {
    try {
      const decoded = this.jwtService.verify(token);

      // Look up current role from the database (not from the old token)
      const client = await this.clientRepository.findOne({ where: { id: decoded.sub } });
      if (!client) {
        throw new UnauthorizedException('Client not found');
      }

      const payload = { sub: client.id, phone: client.phone, role: client.role };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
