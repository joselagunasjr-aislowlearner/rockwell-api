import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './home.entity';
import { HomeMembership } from './home-membership.entity';
import { Resident } from './resident.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class HomesService {
  constructor(
    @InjectRepository(Home) private readonly homeRepo: Repository<Home>,
    @InjectRepository(HomeMembership) private readonly memberRepo: Repository<HomeMembership>,
    @InjectRepository(Resident) private readonly residentRepo: Repository<Resident>,
    private readonly audit: AuditService,
  ) {}

  async findAll(orgId: string): Promise<Home[]> {
    return this.homeRepo.find({ where: { orgId }, order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Home> {
    const home = await this.homeRepo.findOne({ where: { id } });
    if (!home) throw new NotFoundException('Property not found');
    return home;
  }

  async create(data: Partial<Home>, actorId: string): Promise<Home> {
    const home = this.homeRepo.create(data);
    const saved = await this.homeRepo.save(home);
    await this.audit.log({
      actorId, action: 'home.created', resource: 'home',
      resourceId: saved.id, details: { name: saved.name, tier: saved.planTier },
    });
    return saved;
  }

  async update(id: string, data: Partial<Home>, actorId: string): Promise<Home> {
    await this.homeRepo.update(id, data);
    const updated = await this.findOne(id);
    await this.audit.log({
      actorId, action: 'home.updated', resource: 'home',
      resourceId: id, details: data,
    });
    return updated;
  }

  async getMembers(homeId: string): Promise<HomeMembership[]> {
    return this.memberRepo.find({ where: { homeId } });
  }

  async addMember(data: Partial<HomeMembership>, actorId: string): Promise<HomeMembership> {
    const member = this.memberRepo.create(data);
    const saved = await this.memberRepo.save(member);
    await this.audit.log({
      actorId, action: 'member.added', resource: 'home',
      resourceId: data.homeId, details: { userId: data.userId, role: data.role },
    });
    return saved;
  }

  async getResidents(homeId: string): Promise<Resident[]> {
    return this.residentRepo.find({ where: { homeId } });
  }
}
