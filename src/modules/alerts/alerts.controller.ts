import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('api/v1/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findAll(@Query('homeId') homeId?: string) {
    if (homeId) return this.alertsService.findByHome(homeId);
    return this.alertsService.findOpen();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.alertsService.create(data);
  }

  @Put(':id/acknowledge')
  async acknowledge(@Param('id') id: string, @Body() body: { actorId: string; actorName: string }) {
    return this.alertsService.acknowledge(id, body.actorId, body.actorName);
  }

  @Put(':id/resolve')
  async resolve(@Param('id') id: string, @Body() body: {
    actorId: string; actorName: string; rootCause: string; resolutionNotes: string;
  }) {
    return this.alertsService.resolve(id, body.actorId, body.actorName, body);
  }
}
