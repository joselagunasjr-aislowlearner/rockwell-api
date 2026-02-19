import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn
} from 'typeorm';

export enum UserRole {
  ORG_ADMIN = 'org_admin',
  STAFF = 'staff',
  FAMILY_ADMIN = 'family_admin',
  FAMILY_VIEWER = 'family_viewer',
}

export enum MfaStatus {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  ENFORCED = 'enforced',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orgId: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.FAMILY_VIEWER })
  role: UserRole;

  @Column({ type: 'enum', enum: MfaStatus, default: MfaStatus.DISABLED })
  mfaStatus: MfaStatus;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
