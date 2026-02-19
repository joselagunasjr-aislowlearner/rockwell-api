import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, AlertStatus } from './alert.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert) private readonly repo: Repository<Alert>,
    private readonly audit: AuditService,
  ) {}

  async findByHome(homeId: string): Promise<Alert[]> {
    return this.repo.find({ where: { homeId }, order: { createdAt: 'DESC' } });
  }

  async findOpen(): Promise<Alert[]> {
    return this.repo.find({
      where: [
        { status: AlertStatus.OPEN },
        { status: AlertStatus.ACKNOWLEDGED },
        { status: AlertStatus.INVESTIGATING },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Alert> {
    const alert = await this.repo.findOne({ where: { id } });
    if (!alert) throw new NotFoundException('Alert not found');
    return alert;
  }

  async create(data: Partial<Alert>): Promise<Alert> {
    const alert = this.repo.create({
      ...data,
      timeline: [{
        action: 'created',
        timestamp: new Date().toISOString(),
        notes: 'Alert triggered by system',
      }],
    });
    const saved = await this.repo.save(alert);
    await this.audit.log({
      action: 'alert.created', resource: 'alert',
      resourceId: saved.id, details: { title: saved.title, severity: saved.severity },
    });
    return saved;
  }

  async acknowledge(id: string, actorId: string, actorName: string): Promise<Alert> {
    const alert = await this.findOne(id);
    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.ownerId = actorId;
    alert.acknowledgedAt = new Date();
    alert.timeline.push({
      action: 'acknowledged',
      actorId, actorName,
      timestamp: new Date().toISOString(),
    });
    const saved = await this.repo.save(alert);
    await this.audit.log({
      actorId, actorName, action: 'alert.acknowledged', resource: 'alert',
      resourceId: id, details: { title: alert.title },
    });
    return saved;
  }

  async resolve(id: string, actorId: string, actorName: string, data: {
    rootCause: string;
    resolutionNotes: string;
  }): Promise<Alert> {
    const alert = await this.findOne(id);
    alert.status = AlertStatus.RESOLVED;
    alert.rootCause = data.rootCause;
    alert.resolutionNotes = data.resolutionNotes;
    alert.resolvedAt = new Date();
    alert.timeline.push({
      action: 'resolved',
      actorId, actorName,
      timestamp: new Date().toISOString(),
      notes: data.resolutionNotes,
    });
    const saved = await this.repo.save(alert);
    await this.audit.log({
      actorId, actorName, action: 'alert.resolved', resource: 'alert',
      resourceId: id, details: { rootCause: data.rootCause },
    });
    return saved;
  }
}
