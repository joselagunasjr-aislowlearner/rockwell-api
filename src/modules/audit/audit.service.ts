import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(params: {
    actorId?: string;
    actorName?: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, any>;
    ip?: string;
  }): Promise<AuditLog> {
    const entry = this.repo.create(params);
    return this.repo.save(entry);
  }

  async findByResource(resource: string, resourceId: string, limit = 50): Promise<AuditLog[]> {
    return this.repo.find({
      where: { resource, resourceId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByActor(actorId: string, limit = 50): Promise<AuditLog[]> {
    return this.repo.find({
      where: { actorId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findRecent(limit = 100): Promise<AuditLog[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
