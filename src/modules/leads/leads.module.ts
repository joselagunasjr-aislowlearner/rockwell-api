import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './lead.entity';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { ZapierWebhookService } from './zapier-webhook.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lead])],
  providers: [LeadsService, ZapierWebhookService],
  controllers: [LeadsController],
  exports: [LeadsService, ZapierWebhookService],
})
export class LeadsModule {}
