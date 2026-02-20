import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './create-lead.dto';
import { LeadStatus } from './lead.entity';

@Controller('api/v1/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  async findAll(@Query('status') status?: LeadStatus, @Query('source') source?: string) {
    if (status) return this.leadsService.findByStatus(status);
    if (source) return this.leadsService.findBySource(source);
    return this.leadsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: LeadStatus) {
    return this.leadsService.updateStatus(id, status);
  }
}
