import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async findByUserId(userId: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id: userId } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async create(data: Partial<Client>): Promise<Client> {
    const client = this.clientRepository.create(data);
    return this.clientRepository.save(client);
  }

  async update(id: string, data: Partial<Client>): Promise<Client> {
    await this.clientRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }
}
