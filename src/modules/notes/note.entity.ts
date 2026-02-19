import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

export enum NoteCategory {
  GENERAL = 'general',
  MAINTENANCE = 'maintenance',
  VENDOR = 'vendor',
  URGENT = 'urgent',
}

export enum NoteVisibility {
  STAFF_ONLY = 'staff_only',
  STAFF_FAMILY_ADMIN = 'staff_family_admin',
  ALL_MEMBERS = 'all_members',
}

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  homeId: string;

  @Column()
  authorId: string;

  @Column({ nullable: true })
  authorName: string;

  @Column({ type: 'enum', enum: NoteCategory, default: NoteCategory.GENERAL })
  category: NoteCategory;

  @Column({ type: 'enum', enum: NoteVisibility, default: NoteVisibility.STAFF_ONLY })
  visibility: NoteVisibility;

  @Column({ type: 'text' })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
