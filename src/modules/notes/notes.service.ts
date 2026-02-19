import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly repo: Repository<Note>,
    private readonly audit: AuditService,
  ) {}

  async findByHome(homeId: string): Promise<Note[]> {
    return this.repo.find({ where: { homeId }, order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<Note>, actorId: string): Promise<Note> {
    const note = this.repo.create({ ...data, authorId: actorId });
    const saved = await this.repo.save(note);
    await this.audit.log({
      actorId, action: 'note.created', resource: 'note',
      resourceId: saved.id, details: { homeId: saved.homeId, category: saved.category },
    });
    return saved;
  }
}

import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';

@Controller('api/v1/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async findByHome(@Query('homeId') homeId: string) {
    return this.notesService.findByHome(homeId);
  }

  @Post()
  async create(@Body() data: any) {
    return this.notesService.create(data, data.authorId || 'system');
  }
}
