import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  clientId: string;

  @Column({ type: 'varchar' })
  direction: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', nullable: true })
  twilioSid: string;

  @Column({ type: 'varchar', default: 'sent' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;
}
