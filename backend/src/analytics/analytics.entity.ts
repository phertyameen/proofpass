import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  eventId: string;

  // Metrics
  @Column({ type: 'int', default: 0 })
  totalCheckIns: number;

  @Column({ default: '0' })
  totalRevenue: string;

  @Column({ type: 'float', default: 0 })
  checkInRate: number;

  @Column({ type: 'timestamp', nullable: true })
  averageCheckInTime?: Date;

  // Time Series Data (JSON)
  @Column({ type: 'jsonb', nullable: true })
  checkInsByHour?: any;

  @Column({ type: 'jsonb', nullable: true })
  checkInsByDay?: any;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}