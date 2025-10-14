import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';

// Import ABIs
import EVENT_REGISTRY_ABI from '../abis/EventRegistry.json';
import ATTENDANCE_VERIFIER_ABI from '../abis/AttendanceVerifier.json';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/transaction.entity';

@Injectable()
export class BlockchainService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private eventRegistryContract: ethers.Contract;
  private attendanceVerifierContract: ethers.Contract;
  private isListening = false;

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async onModuleInit() {
    try {
      // Initialize provider with retry logic
      const rpcUrl = this.configService.get<string>('BASE_SEPOLIA_RPC_URL');
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Test connection
      const network = await this.provider.getNetwork();
      this.logger.log(
        `Connected to network: ${network.name} (chainId: ${network.chainId})`,
      );

      // Initialize contracts
      const eventRegistryAddress = this.configService.get<string>(
        'EVENT_REGISTRY_ADDRESS',
      );
      const attendanceVerifierAddress = this.configService.get<string>(
        'ATTENDANCE_VERIFIER_ADDRESS',
      );

      if (!eventRegistryAddress || !attendanceVerifierAddress) {
        throw new Error(
          'Contract addresses are not defined in environment variables',
        );
      }

      this.eventRegistryContract = new ethers.Contract(
        eventRegistryAddress,
        EVENT_REGISTRY_ABI.abi,
        this.provider,
      );

      this.attendanceVerifierContract = new ethers.Contract(
        attendanceVerifierAddress,
        ATTENDANCE_VERIFIER_ABI.abi,
        this.provider,
      );

      this.logger.log(`EventRegistry contract: ${eventRegistryAddress}`);
      this.logger.log(
        `AttendanceVerifier contract: ${attendanceVerifierAddress}`,
      );

      // Start listening to events
      await this.startListening();

      this.logger.log('✅ Blockchain service initialized successfully');
    } catch (error) {
      this.logger.error(
        `❌ Failed to initialize blockchain service: ${error.message}`,
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.stopListening();
    this.logger.log('Blockchain service destroyed');
  }

  private async startListening() {
    if (this.isListening) {
      this.logger.warn('Already listening to blockchain events');
      return;
    }

    // Listen to EventCreated events
    this.eventRegistryContract.on(
      'EventCreated',
      async (
        eventId,
        organizer,
        metadataHash,
        attendanceFee,
        timestamp,
        event,
      ) => {
        try {
          const payload = {
            eventId: Number(eventId),
            organizer: organizer.toLowerCase(),
            metadataHash,
            attendanceFee: ethers.formatEther(attendanceFee),
            timestamp: new Date(Number(timestamp) * 1000),
            transactionHash: event.log.transactionHash,
            blockNumber: event.log.blockNumber,
          };

          this.logger.log(`🎉 EventCreated: Event ID ${payload.eventId}`);

          // Save transaction
          await this.saveTransaction({
            hash: payload.transactionHash,
            type: TransactionType.EVENT_CREATED,
            from: payload.organizer,
            to: this.eventRegistryContract.target as string,
            value: '0',
            blockNumber: payload.blockNumber,
            timestamp: payload.timestamp,
            status: TransactionStatus.CONFIRMED,
          });

          // Emit internal event
          this.eventEmitter.emit('blockchain.eventCreated', payload);
        } catch (error) {
          this.logger.error(`Error handling EventCreated: ${error.message}`);
        }
      },
    );

    // Listen to CheckIn events
    this.attendanceVerifierContract.on(
      'CheckIn',
      async (eventId, attendee, timestamp, feePaid, event) => {
        try {
          const payload = {
            eventId: Number(eventId),
            attendee: attendee.toLowerCase(),
            timestamp: new Date(Number(timestamp) * 1000),
            feePaid: ethers.formatEther(feePaid),
            transactionHash: event.log.transactionHash,
            blockNumber: event.log.blockNumber,
          };

          this.logger.log(
            `✅ CheckIn: Event ID ${payload.eventId}, Attendee ${payload.attendee.slice(0, 8)}...`,
          );

          // Save transaction
          await this.saveTransaction({
            hash: payload.transactionHash,
            type: TransactionType.CHECK_IN,
            from: payload.attendee,
            to: this.attendanceVerifierContract.target as string,
            value: payload.feePaid,
            blockNumber: payload.blockNumber,
            timestamp: payload.timestamp,
            status: TransactionStatus.CONFIRMED,
          });

          // Emit internal event
          this.eventEmitter.emit('blockchain.checkIn', payload);
        } catch (error) {
          this.logger.error(`Error handling CheckIn: ${error.message}`);
        }
      },
    );

    this.isListening = true;
    this.logger.log('🎧 Started listening to blockchain events');
  }

  private async stopListening() {
    if (!this.isListening) return;

    this.eventRegistryContract.removeAllListeners();
    this.attendanceVerifierContract.removeAllListeners();
    this.isListening = false;

    this.logger.log('🔇 Stopped listening to blockchain events');
  }

  private async saveTransaction(
    data: Partial<Transaction>,
  ): Promise<Transaction> {
    try {
      // Check if transaction already exists
      const existing = await this.transactionRepository.findOne({
        where: { hash: data.hash },
      });

      if (existing) {
        this.logger.debug(`Transaction ${data.hash} already exists`);
        return existing;
      }

      // Create new transaction record
      const transaction = this.transactionRepository.create(data);
      return await this.transactionRepository.save(transaction);
    } catch (error) {
      this.logger.error(`Failed to save transaction: ${error.message}`);
      throw error;
    }
  }

  // Helper methods for manual queries
  async getEvent(eventId: string) {
    return await this.eventRegistryContract.getEvent(eventId);
  }

  async verifyAttendance(eventId: number, attendee: string): Promise<boolean> {
    return await this.attendanceVerifierContract.verifyAttendance(
      eventId,
      attendee,
    );
  }

  async getEventAttendees(eventId: number): Promise<string[]> {
    return await this.attendanceVerifierContract.getEventAttendees(eventId);
  }

  async getAttendanceCount(eventId: number): Promise<number> {
    const count =
      await this.attendanceVerifierContract.getAttendanceCount(eventId);
    return Number(count);
  }

  // Get current block number
  async getCurrentBlock(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  // Get transaction receipt
  async getTransactionReceipt(txHash: string) {
    return await this.provider.getTransactionReceipt(txHash);
  }
}
