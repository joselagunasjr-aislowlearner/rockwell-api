import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  OneToMany
} from 'typeorm';

export enum PlanTier {
  ESSENTIAL = 'essential',
  PREMIER = 'premier',
  ESTATE = 'estate',
}

export enum HomeStatus {
  ACTIVE = 'active',
  ONBOARDING = 'onboarding',
  PAUSED = 'paused',
  INACTIVE = 'inactive',
}

@Entity('homes')
export class Home {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orgId: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ default: 'WI' })
  state: string;

  @Column()
  zip: string;

  @Column({ default: 'America/Chicago' })
  timezone: string;

  @Column({ type: 'enum', enum: PlanTier, default: PlanTier.ESSENTIAL })
  planTier: PlanTier;

  @Column({ type: 'enum', enum: HomeStatus, default: HomeStatus.ONBOARDING })
  status: HomeStatus;

  @Column({ type: 'jsonb', nullable: true })
  accessNotes: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  vendorContacts: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true })
  riskTags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
