import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventDto } from './dto/event.dto';
import { EventsService } from './events.service';
import { PaginatedEventsResponseDto } from './dto/event-list-query.dto';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new event',
    description: 'Create a new event (requires authentication)',
  })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: EventDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Request() req: any,
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventDto> {
    return await this.eventsService.create({
      ...createEventDto,
      organizerId: req.user.id,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get all events',
    description: 'Retrieve paginated list of events with optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    type: PaginatedEventsResponseDto,
  })
  async findAll(
    @Query() query: EventDto,
  ): Promise<PaginatedEventsResponseDto> {
    return await this.eventsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get event by ID',
    description: 'Retrieve detailed information about a specific event',
  })
  @ApiParam({ name: 'id', description: 'Event ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully',
    type: EventDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string): Promise<EventDto> {
    return await this.eventsService.findOne(id);
  }

  @Patch(':id')
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update event',
    description: 'Update event details (organizer only)',
  })
  @ApiParam({ name: 'id', description: 'Event ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: EventDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not event organizer' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req: any,
  ): Promise<EventDto> {
    return await this.eventsService.update(id, updateEventDto, req.user.id);
  }

  @Delete(':id')
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete event',
    description: 'Deactivate event (organizer only)',
  })
  @ApiParam({ name: 'id', description: 'Event ID (UUID)' })
  @ApiResponse({ status: 204, description: 'Event deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    await this.eventsService.remove(id, req.user.id);
  }
}
