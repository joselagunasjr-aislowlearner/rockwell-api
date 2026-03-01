import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private readonly client: Twilio;
  private readonly logger = new Logger(TwilioService.name);

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN');
    }

    this.client = new Twilio(accountSid, authToken);
  }

  getClient(): Twilio {
    return this.client;
  }

  async sendSms(to: string, body: string): Promise<string> {
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!fromNumber) {
      throw new Error('Missing TWILIO_PHONE_NUMBER environment variable');
    }

    try {
      const message = await this.client.messages.create({
        to,
        from: fromNumber,
        body,
      });
      this.logger.log(`SMS sent to ${to}: ${message.sid}`);
      return message.sid;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  getVerifyService() {
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    if (!serviceSid) {
      throw new Error('Missing TWILIO_VERIFY_SERVICE_SID');
    }
    return this.client.verify.v2.services(serviceSid);
  }
}
