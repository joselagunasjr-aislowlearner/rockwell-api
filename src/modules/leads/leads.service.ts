import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { ZapierWebhookService } from './zapier-webhook.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectRepository(Lead) private readonly repo: Repository<Lead>,
    private readonly zapier: ZapierWebhookService,
    private readonly audit: AuditService,
  ) {}

  async findAll(): Promise<Lead[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.repo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async findByStatus(status: LeadStatus): Promise<Lead[]> {
    return this.repo.find({ where: { status }, order: { createdAt: 'DESC' } });
  }

  async findBySource(source: string): Promise<Lead[]> {
    return this.repo.find({ where: { source: source as any }, order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateLeadDto, actorId = 'system'): Promise<Lead> {
    const lead = this.repo.create(dto);
    const saved = await this.repo.save(lead);
    this.logger.log(`Lead created: ${saved.id} (${saved.firstName} ${saved.lastName})`);

    // Push to M360 via Zapier (non-blocking)
    this.pushToZapier(saved).catch((err) =>
      this.logger.error(`Background Zapier push failed for lead ${saved.id}: ${err.message}`),
    );

    await this.audit.log({
      actorId,
      action: 'lead.created',
      resource: 'lead',
      resourceId: saved.id,
      details: { email: saved.email, source: saved.source, serviceInterest: saved.serviceInterest },
    });

    return saved;
  }

  async updateStatus(id: string, status: LeadStatus, actorId = 'system'): Promise<Lead> {
    const lead = await this.findOne(id);
    lead.status = status;
    const updated = await this.repo.save(lead);
    await this.audit.log({
      actorId,
      action: 'lead.status_updated',
      resource: 'lead',
      resourceId: id,
      details: { newStatus: status },
    });
    return updated;
  }

  private async pushToZapier(lead: Lead): Promise<void> {
    const result = await this.zapier.pushLead({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      serviceInterest: lead.serviceInterest,
      street: lead.street,
      city: lead.city,
      state: lead.state,
      zip: lead.zip,
      notes: lead.notes,
    });

    if (result.success) {
      await this.repo.update(lead.id, {
        syncedToM360: true,
        m360ContactId: result.zapierRequestId || undefined,
      });
      this.logger.log(`Lead ${lead.id} synced to M360`);
    } else {
      this.logger.warn(`Lead ${lead.id} failed to sync to M360: ${result.error}`);
    }
  }
}
