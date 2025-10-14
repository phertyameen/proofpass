import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/event/event.entity';
import { Repository } from 'typeorm';

interface EventCreatedPayload {
  eventId: number;
  organizer: string;
  metadataHash: string;
  attendanceFee: string;
  timestamp: Date;
  transactionHash: string;
  blockNumber: number;
}

@Injectable()
export class EventCreatedListener {
  private readonly logger = new Logger(EventCreatedListener.name);

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  @OnEvent('blockchain.eventCreated')
  async handleEventCreated(payload: EventCreatedPayload) {
    this.logger.log(`Processing EventCreated: blockchain ID ${payload.eventId}`);

    try {
      // Find event in database by transaction hash
      // (Event was created by frontend first, now we update it with blockchain data)
      const event = await this.eventRepository.findOne({
        where: { transactionHash: payload.transactionHash },
      });

      if (!event) {
        this.logger.warn(`Event with tx ${payload.transactionHash} not found in database`);
        return;
      }

      // Update event with blockchain event ID
      event.eventId = payload.eventId;
      event.metadataHash = payload.metadataHash;
      await this.eventRepository.save(event);

      this.logger.log(`✅ Event ${event.id} updated with blockchain ID ${payload.eventId}`);
    } catch (error) {
      this.logger.error(`Failed to process EventCreated: ${error.message}`, error.stack);
    }
  }
}