import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Client } from '../clients/entities/client.entity';
import { TwilioService } from '../twilio/twilio.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly twilioService: TwilioService,
  ) {}

  async sendMessage(clientId: string, body: string): Promise<Message> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Client not found');

    const twilioSid = await this.twilioService.sendSms(client.phone, body);

    const message = this.messageRepository.create({
      clientId,
      direction: 'outbound',
      body,
      twilioSid,
      status: 'sent',
    });

    return this.messageRepository.save(message);
  }

  async saveInboundMessage(from: string, body: string, twilioSid: string): Promise<Message | null> {
    const client = await this.clientRepository.findOne({ where: { phone: from } });
    if (!client) {
      this.logger.warn(`Inbound SMS from unknown number: ${from}`);
      return null;
    }

    const message = this.messageRepository.create({
      clientId: client.id,
      direction: 'inbound',
      body,
      twilioSid,
      status: 'received',
    });

    return this.messageRepository.save(message);
  }

  async findByClientId(clientId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
  }
}
