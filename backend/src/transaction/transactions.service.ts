import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus, TransactionType } from './transaction.entity';

export interface CreateTransactionDto {
  hash: string;
  type: TransactionType;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp: Date;
  status?: TransactionStatus;
  gasUsed?: string;
  gasPrice?: string;
  eventId?: string;
  attendanceId?: string;
}

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    try {
      // Check if transaction already exists
      const existing = await this.transactionRepository.findOne({
        where: { hash: createTransactionDto.hash },
      });

      if (existing) {
        this.logger.debug(`Transaction ${createTransactionDto.hash} already exists`);
        return existing;
      }

      const transaction = this.transactionRepository.create(createTransactionDto);
      const saved = await this.transactionRepository.save(transaction);

      this.logger.log(`Transaction ${saved.hash} created with status ${saved.status}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to create transaction: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async findByHash(hash: string): Promise<Transaction | null> {
    return await this.transactionRepository.findOne({
      where: { hash },
    });
  }

  async findByEvent(eventId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { eventId },
      order: { timestamp: 'DESC' },
    });
  }

  async updateStatus(hash: string, status: TransactionStatus): Promise<Transaction> {
    const transaction = await this.findByHash(hash);

    if (!transaction) {
      throw new NotFoundException(`Transaction with hash ${hash} not found`);
    }

    transaction.status = status;
    return await this.transactionRepository.save(transaction);
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }
}