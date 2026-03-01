import {
  Controller, Post, Body, Req, Headers,
  UseGuards, Logger, HttpCode, Header, ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MessagesService } from './messages.service';

// Twilio uses `export =` so we need require for the validateRequest helper
// eslint-disable-next-line @typescript-eslint/no-var-requires
const twilio = require('twilio');

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  private readonly logger = new Logger(MessagesController.name);

  constructor(private readonly messagesService: MessagesService) {}

  @Post('send')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async sendMessage(@Body() body: { clientId: string; body: string }) {
    return this.messagesService.sendMessage(body.clientId, body.body);
  }

  @Post('inbound-webhook')
  @HttpCode(200)
  @Header('Content-Type', 'text/xml')
  async inboundWebhook(
    @Req() req: any,
    @Headers('x-twilio-signature') signature: string,
    @Body() body: any,
  ) {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (signature && authToken) {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const url = `${protocol}://${req.get('host')}${req.originalUrl}`;
      if (!twilio.validateRequest(authToken, signature, url, body)) {
        this.logger.warn('Invalid Twilio webhook signature');
        throw new ForbiddenException('Invalid Twilio signature');
      }
    }

    const { From, Body: smsBody, MessageSid } = body;
    this.logger.log(`Inbound SMS from ${From}: ${MessageSid}`);

    await this.messagesService.saveInboundMessage(From, smsBody, MessageSid);

    return '<Response></Response>';
  }
}
