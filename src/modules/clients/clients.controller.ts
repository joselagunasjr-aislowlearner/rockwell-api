import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // Any authenticated client — returns their own profile
  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMyProfile(@Request() req: any): Promise<Client> {
    return this.clientsService.findByUserId(req.user.userId);
  }

  // Admin only — list all clients
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll(): Promise<Client[]> {
    return this.clientsService.findAll();
  }

  // Admin only — get any client by ID
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string): Promise<Client> {
    return this.clientsService.findOne(id);
  }

  // Admin only — create client
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createClientDto: Partial<Client>): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  // Admin only — update client
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: Partial<Client>,
  ): Promise<Client> {
    return this.clientsService.update(id, updateClientDto);
  }

  // Admin only — delete client
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    return this.clientsService.remove(id);
  }
}
