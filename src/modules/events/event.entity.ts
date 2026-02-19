import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index
} from 'typeorm';

@Entity('events')
@Index(['homeId', 'timestamp'])
@Index(['deviceId', 'timestamp'])
export class SensorEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  homeId: string;

  @Column()
  deviceId: string;

  @Column()
  eventType: string;

  @Column({ type: 'jsonb' })
  value: Record<string, any>;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ default: 'zigbee2mqtt' })
  source: string;

  @CreateDateColumn()
  createdAt: Date;
}
