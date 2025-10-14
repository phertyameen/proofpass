import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatus } from '../enums/eventStatus.enum';

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
}