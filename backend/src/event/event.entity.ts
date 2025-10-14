import { Attendance } from 'src/attendance/attendance.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';

@Entity('events')
@Index(['organizerId'])
@Index(['startTime'])
@Index(['isActive'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  eventId: number; // Blockchain event ID

  @Column()
  organizerId: string;

  @ManyToOne(() => User, (user: User) => user.organizedEvents)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  // Event Details
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column({ default: 'UTC' })
  timezone: string;

  // Blockchain Data
  @Column('int')
  maxAttendees: number;

  @Column({ type: 'int', default: 0 })
  currentAttendees: number;

  @Column() // Stored as string (ETH amount)
  attendanceFee: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ unique: true })
  @Index()
  transactionHash: string;

  @Column() // IPFS hash
  metadataHash: string;

  // Off-Chain Data
  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  category?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.event)
  attendances: Attendance[];
}