import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

export enum VisitType {
  ROUTINE = 'routine',
  SAFETY_AUDIT = 'safety_audit',
  VENDOR = 'vendor',
  EMERGENCY = 'emergency',
  DEVICE_INSTALL = 'device_install',
}

export enum FollowUpStatus {
  NONE = 'none',
  SCHEDULED = 'scheduled',
  VENDOR_NEEDED = 'vendor_needed',
  URGENT = 'urgent',
}

@Entity('visit_reports')
export class VisitReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  homeId: string;

  @Column()
  staffId: string;

  @Column({ nullable: true })
  staffName: string;

  @Column({ type: 'enum', enum: VisitType })
  visitType: VisitType;

  @Column({ type: 'jsonb' })
  checklist: Array<{
    item: string;
    checked: boolean;
    checkedAt?: string;
  }>;

  @Column({ type: 'simple-array', nullable: true })
  photoKeys: string[];

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'enum', enum: FollowUpStatus, default: FollowUpStatus.NONE })
  followUp: FollowUpStatus;

  @Column({ type: 'int', nullable: true })
  durationMinutes: number;

  @Column({ type: 'timestamp' })
  visitDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
