import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitReport } from './visit-report.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(VisitReport) private readonly repo: Repository<VisitReport>,
    private readonly audit: AuditService,
  ) {}

  async findByHome(homeId: string): Promise<VisitReport[]> {
    return this.repo.find({ where: { homeId }, order: { visitDate: 'DESC' } });
  }

  async findRecent(limit = 20): Promise<VisitReport[]> {
    return this.repo.find({ order: { visitDate: 'DESC' }, take: limit });
  }

  async create(data: Partial<VisitReport>, actorId: string): Promise<VisitReport> {
    const report = this.repo.create({ ...data, staffId: actorId });
    const saved = await this.repo.save(report);
    await this.audit.log({
      actorId, action: 'visit.completed', resource: 'visit_report',
      resourceId: saved.id, details: { homeId: saved.homeId, type: saved.visitType },
    });
    return saved;
  }
}

import { Controller, Get, Post, Body, Query } from '@nestjs/common';

@Controller('api/v1/visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get()
  async findAll(@Query('homeId') homeId?: string) {
    if (homeId) return this.visitsService.findByHome(homeId);
    return this.visitsService.findRecent();
  }

  @Post()
  async create(@Body() data: any) {
    return this.visitsService.create(data, data.staffId || 'system');
  }
}
