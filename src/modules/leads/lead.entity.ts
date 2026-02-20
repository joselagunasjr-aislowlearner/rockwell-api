import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LeadSource {
  CHAMBER = 'Chamber',
  ADRC = 'ADRC',
  ESTATE_ATTORNEY = 'Estate Attorney',
  REALTOR = 'Realtor',
  HOSPITAL_DISCHARGE = 'Hospital Discharge',
  WEBSITE = 'Website',
  REFERRAL = 'Referral',
  CONTACT_FORM = 'Contact Form',
  SAFETY_AUDIT = 'Safety Audit',
  OTHER = 'Other',
}

export enum LeadStatus {
  NEW = 'New Lead',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  PROPOSAL_SENT = 'Proposal Sent',
  CONVERTED = 'Converted',
  DEAD = 'Dead Lead',
}

export enum ServiceInterest {
  ESSENTIAL_WATCH = 'Essential Watch',
  PREMIER_MANAGEMENT = 'Premier Management',
  ESTATE_CONCIERGE = 'Estate Concierge',
  SAFETY_AUDIT = 'Safety Audit',
  UNDECIDED = 'Undecided',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: 'WI' })
  state: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ type: 'enum', enum: LeadSource, default: LeadSource.OTHER })
  source: LeadSource;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  @Column({ type: 'enum', enum: ServiceInterest, default: ServiceInterest.UNDECIDED })
  serviceInterest: ServiceInterest;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true })
  m360ContactId: string;

  @Column({ default: false })
  syncedToM360: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
