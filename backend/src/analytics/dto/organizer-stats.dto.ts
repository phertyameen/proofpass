import { ApiProperty } from '@nestjs/swagger';

export class EventStatsDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  eventId: string;

  @ApiProperty({ example: 'Web3 Workshop' })
  title: string;

  @ApiProperty({ example: 45 })
  totalAttendees: number;

  @ApiProperty({ example: '0.045' })
  revenue: string;

  @ApiProperty({ example: 0.75 })
  checkInRate: number;
}

export class OrganizerStatsDto {
  @ApiProperty({
    description: 'Total events created',
    example: 12,
  })
  totalEvents: number;

  @ApiProperty({
    description: 'Total attendees across all events',
    example: 540,
  })
  totalAttendees: number;

  @ApiProperty({
    description: 'Total revenue in ETH',
    example: '0.540',
  })
  totalRevenue: string;

  @ApiProperty({
    description: 'Average attendance per event',
    example: 45,
  })
  averageAttendance: number;

  @ApiProperty({
    description: 'Breakdown by event',
    type: [EventStatsDto],
  })
  eventBreakdown: EventStatsDto[];
}