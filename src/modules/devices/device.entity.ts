import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

export enum DeviceType {
  CONTACT = 'contact',
  MOTION = 'motion',
  LEAK = 'leak',
  CLIMATE = 'climate',
  LOCK = 'lock',
  THERMOSTAT = 'thermostat',
  PILLBOX = 'pillbox',
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  LOW_BATTERY = 'low_battery',
  ERROR = 'error',
}

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  homeId: string;

  @Column({ nullable: true })
  hubId: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: DeviceType })
  type: DeviceType;

  @Column({ nullable: true })
  zigbeeId: string;

  @Column({ type: 'float', nullable: true })
  battery: number;

  @Column({ type: 'enum', enum: DeviceStatus, default: DeviceStatus.ONLINE })
  status: DeviceStatus;

  @Column({ nullable: true })
  firmwareVersion: string;

  @Column({ type: 'timestamp', nullable: true })
  lastSeen: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
