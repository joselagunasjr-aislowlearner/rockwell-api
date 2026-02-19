import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device) private readonly repo: Repository<Device>,
  ) {}

  async findByHome(homeId: string): Promise<Device[]> {
    return this.repo.find({ where: { homeId }, order: { name: 'ASC' } });
  }

  async findAll(): Promise<Device[]> {
    return this.repo.find({ order: { homeId: 'ASC', name: 'ASC' } });
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.repo.findOne({ where: { id } });
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  async updateStatus(id: string, data: Partial<Device>): Promise<Device> {
    await this.repo.update(id, { ...data, lastSeen: new Date() });
    return this.findOne(id);
  }
}

import { Controller, Get, Put, Param, Body, Query } from '@nestjs/common';

@Controller('api/v1/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  async findAll(@Query('homeId') homeId?: string) {
    if (homeId) return this.devicesService.findByHome(homeId);
    return this.devicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() data: any) {
    return this.devicesService.updateStatus(id, data);
  }
}
