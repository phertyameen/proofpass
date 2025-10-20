import { Attendance } from 'src/attendance/attendance.entity';
import { Event } from 'src/event/event.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  walletAddress: string;

  @Column({ unique: true, nullable: true })
  fid: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  nonce?: string | null; 

  @Column({ default: false })
  isOrganizer: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Event, (event) => event.organizer)
  organizedEvents: Event[];

  @OneToMany(() => Attendance, (attendance) => attendance.attendee)
  attendances: Attendance[];
}