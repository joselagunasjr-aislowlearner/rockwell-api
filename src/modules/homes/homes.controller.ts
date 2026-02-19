import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { HomesService } from './homes.service';
import { Home } from './home.entity';

@Controller('api/v1/homes')
export class HomesController {
  constructor(private readonly homesService: HomesService) {}

  @Get()
  async findAll(@Query('orgId') orgId: string): Promise<Home[]> {
    return this.homesService.findAll(orgId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Home> {
    return this.homesService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Home>): Promise<Home> {
    // TODO: extract actorId from JWT
    return this.homesService.create(data, 'system');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Home>): Promise<Home> {
    return this.homesService.update(id, data, 'system');
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.homesService.getMembers(id);
  }

  @Get(':id/residents')
  async getResidents(@Param('id') id: string) {
    return this.homesService.getResidents(id);
  }
}
