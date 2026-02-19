import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Unique
} from 'typeorm';

export enum HomeMemberRole {
  OWNER = 'owner',
  FAMILY_ADMIN = 'family_admin',
  FAMILY_VIEWER = 'family_viewer',
  STAFF = 'staff',
}

@Entity('home_memberships')
@Unique(['userId', 'homeId'])
export class HomeMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  homeId: string;

  @Column({ type: 'enum', enum: HomeMemberRole })
  role: HomeMemberRole;

  @Column({ type: 'jsonb', nullable: true })
  permissions: Record<string, boolean>;

  @CreateDateColumn()
  createdAt: Date;
}
