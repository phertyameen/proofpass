import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  EVENT_CREATED = 'EVENT_CREATED',
  CHECK_IN = 'CHECK_IN',
  FEE_WITHDRAWAL = 'FEE_WITHDRAWAL',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
}

@Entity('transactions')
@Index(['type'])
@Index(['status'])
export class Transaction {
  @ApiProperty({ example: 'uuid-1234-5678' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '0xabc123def456...' })
  @Column({ unique: true })
  @Index()
  hash: string;

  @ApiProperty({
    example: 'EVENT_CREATED',
    enum: TransactionType,
  })
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @ApiProperty({ example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' })
  @Column()
  from: string;

  @ApiProperty({ example: '0x1234567890abcdef...' })
  @Column()
  to: string;

  @ApiProperty({ example: '0.001' })
  @Column()
  value: string;

  @ApiProperty({ example: '21000' })
  @Column({ nullable: true })
  gasUsed?: string;

  @ApiProperty({ example: '1000000000' })
  @Column({ nullable: true })
  gasPrice?: string;

  @ApiProperty({ example: 12345678 })
  @Column('int')
  blockNumber: number;

  @ApiProperty({ example: '2025-01-15T18:30:00Z' })
  @Column('timestamp')
  timestamp: Date;

  @ApiProperty({
    example: 'CONFIRMED',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @ApiProperty({ example: 'uuid-event-123', required: false })
  @Column({ nullable: true })
  eventId?: string;

  @ApiProperty({ example: 'uuid-attendance-123', required: false })
  @Column({ nullable: true })
  attendanceId?: string;

  @ApiProperty({ example: '2025-01-15T18:30:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T18:31:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
