import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/attendance/attendance.entity';
import { Event } from 'src/event/event.entity';
import { Repository } from 'typeorm';

interface CheckInPayload {
  eventId: number;
  attendee: string;
  timestamp: Date;
  feePaid: string;
  transactionHash: string;
  blockNumber: number;
}

@Injectable()
export class CheckInListener {
  private readonly logger = new Logger(CheckInListener.name);

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  @OnEvent('blockchain.checkIn')
  async handleCheckIn(payload: CheckInPayload) {
    this.logger.log(`Processing CheckIn: Event ${payload.eventId}, Attendee ${payload.attendee.slice(0, 8)}...`);

    try {
      // Find event by blockchain event ID
      const event = await this.eventRepository.findOne({
        where: { eventId: payload.eventId },
      });

      if (!event) {
        this.logger.warn(`Event with blockchain ID ${payload.eventId} not found`);
        return;
      }

      // Check if attendance already recorded
      const existing = await this.attendanceRepository.findOne({
        where: { transactionHash: payload.transactionHash },
      });

      if (existing) {
        this.logger.debug(`Attendance already recorded for tx ${payload.transactionHash}`);
        return;
      }

      // Find or create attendee user would happen here via UsersService
      // For now, we'll assume the user exists (created during auth)

      // Increment event attendee count
      event.currentAttendees += 1;
      await this.eventRepository.save(event);

      this.logger.log(`✅ CheckIn processed: Event ${event.title}, Total attendees: ${event.currentAttendees}`);
    } catch (error) {
      this.logger.error(`Failed to process CheckIn: ${error.message}`, error.stack);
    }
  }
}