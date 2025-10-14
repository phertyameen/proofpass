import { Event } from 'src/event/event.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, JoinColumn, Unique } from 'typeorm';

@Entity('attendances')
@Unique(['eventId', 'attendeeId'])
@Index(['eventId'])
@Index(['attendeeId'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @ManyToOne(() => Event, (event: Event) => event.attendances)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  attendeeId: string;

  @ManyToOne(() => User, (user: User) => user.attendances)
  @JoinColumn({ name: 'attendeeId' })
  attendee: User;

  // Blockchain Data
  @Column({ unique: true })
  @Index()
  transactionHash: string;

  @Column('int')
  blockNumber: number;

  @Column('timestamp')
  timestamp: Date;

  @Column() // ETH amount as string
  feePaid: string;

  // Off-Chain Data
  @Column({ default: 'QR' }) // QR, Manual, API
  checkInMethod: string;

  @Column({ type: 'int', nullable: true })
  nftTokenId?: number;

  @Column({ nullable: true })
  nftUrl?: string;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}