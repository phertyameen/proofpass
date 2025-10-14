import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatus } from '../enums/eventStatus.enum';
import { EventDto } from './event.dto';

export class EventListQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Event status filter',
    enum: EventStatus,
    default: EventStatus.ALL,
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus = EventStatus.ALL;

  @ApiPropertyOptional({
    description: 'Filter by organizer ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  organizerId?: string;

  @ApiPropertyOptional({
    description: 'Search by title or description',
    example: 'web3',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Filter by active status',
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Filter by category',
    example: 'Workshop',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
}

export class PaginatedEventsResponseDto {
  @ApiProperty({ type: [EventDto] })
  events: EventDto[];

  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}