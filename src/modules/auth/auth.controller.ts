import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerifyService } from './verify.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly verifyService: VerifyService) {}

  @Post('send-code')
  async sendCode(@Body('phone') phone: string) {
    return this.verifyService.sendCode(phone);
  }

  @Post('verify-code')
  async verifyCode(
    @Body('phone') phone: string,
    @Body('code') code: string,
  ) {
    return this.verifyService.verifyCode(phone, code);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.verifyService.refreshAccessToken(refreshToken);
  }
}
