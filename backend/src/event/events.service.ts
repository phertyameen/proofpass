import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDto } from './dto/event.dto';
import { Event } from './event.entity';
import { EventListQueryDto, PaginatedEventsResponseDto } from './dto/event-list-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto & { organizerId: string }): Promise<EventDto> {
    try {
      // Validate dates
      const startTime = new Date(createEventDto.startTime);
      const endTime = new Date(createEventDto.endTime);

      if (endTime <= startTime) {
        throw new BadRequestException('End time must be after start time');
      }

      // Create event
      const event = this.eventRepository.create({
        ...createEventDto,
        startTime,
        endTime,
        currentAttendees: 0,
        isActive: true,
      });

      const savedEvent = await this.eventRepository.save(event);
      this.logger.log(`Event created: ${savedEvent.id} by organizer ${createEventDto.organizerId}`);

      return this.toResponseDto(savedEvent);
    } catch (error) {
      this.logger.error(`Failed to create event: ${error.message}`);
      throw error;
    }
  }

  async findAll(query: EventListQueryDto): Promise<PaginatedEventsResponseDto> {
    const { page = 1, limit = 10, organizerId, isActive, search, category } = query;

    const whereClause: any = {};

    if (organizerId) {
      whereClause.organizerId = organizerId;
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive;
    }

    if (category) {
      whereClause.category = category;
    }

    const findOptions: FindManyOptions<Event> = {
      where: whereClause,
      relations: ['organizer'],
      order: { startTime: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    // Add search filter
    if (search) {
      findOptions.where = [
        { ...whereClause, title: Like(`%${search}%`) },
        { ...whereClause, description: Like(`%${search}%`) },
      ];
    }

    const [events, total] = await this.eventRepository.findAndCount(findOptions);

    return {
      events: events.map((event) => this.toResponseDto(event)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'attendances'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return this.toResponseDto(event);
  }

  async findByEventId(eventId: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { eventId },
      relations: ['organizer'],
    });

    if (!event) {
      throw new NotFoundException(`Event with blockchain ID ${eventId} not found`);
    }

    return event;
  }

  async findByTransactionHash(transactionHash: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { transactionHash },
    });

    if (!event) {
      throw new NotFoundException(`Event with transaction hash ${transactionHash} not found`);
    }

    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check if user is the organizer
    if (event.organizerId !== userId) {
      throw new ForbiddenException('You are not the organizer of this event');
    }

    // Validate dates if provided
    if (updateEventDto.startTime || updateEventDto.endTime) {
      const startTime = updateEventDto.startTime
        ? new Date(updateEventDto.startTime)
        : event.startTime;
      const endTime = updateEventDto.endTime ? new Date(updateEventDto.endTime) : event.endTime;

      if (endTime <= startTime) {
        throw new BadRequestException('End time must be after start time');
      }

      updateEventDto.startTime = startTime;
      updateEventDto.endTime = endTime;
    }

    // Update event
    Object.assign(event, updateEventDto);
    const updatedEvent = await this.eventRepository.save(event);

    this.logger.log(`Event ${id} updated by user ${userId}`);

    return this.toResponseDto(updatedEvent);
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check if user is the organizer
    if (event.organizerId !== userId) {
      throw new ForbiddenException('You are not the organizer of this event');
    }

    // Soft delete - just deactivate the event
    event.isActive = false;
    await this.eventRepository.save(event);

    this.logger.log(`Event ${id} deactivated by user ${userId}`);
  }

  async incrementAttendees(eventId: string): Promise<void> {
    await this.eventRepository.increment({ id: eventId }, 'currentAttendees', 1);
    this.logger.debug(`Incremented attendees for event ${eventId}`);
  }

  async updateFromBlockchain(payload: {
    eventId: number;
    metadataHash: string;
    transactionHash: string;
  }): Promise<void> {
    const event = await this.findByTransactionHash(payload.transactionHash);

    event.eventId = payload.eventId;
    event.metadataHash = payload.metadataHash;

    await this.eventRepository.save(event);
    this.logger.log(`Event ${event.id} updated from blockchain with ID ${payload.eventId}`);
  }

  // Helper method to convert entity to DTO
  private toResponseDto(event: Event): EventDto {
    return {
      id: event.id,
      eventId: event.eventId,
      organizerId: event.organizerId,
      organizer: {
            id: event.organizer.id,
            walletAddress: event.organizer.walletAddress,
            displayName: event.organizer.displayName,
            email: event.organizer.email,
            isOrganizer: event.organizer.isOrganizer,
            createdAt: event.organizer.createdAt,
            updatedAt: event.organizer.updatedAt
          },
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      maxAttendees: event.maxAttendees,
      currentAttendees: event.currentAttendees,
      attendanceFee: event.attendanceFee,
      isActive: event.isActive,
      transactionHash: event.transactionHash,
      metadataHash: event.metadataHash,
      imageUrl: event.imageUrl,
      category: event.category,
      tags: event.tags,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}