import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimeSeriesDto {
  @ApiProperty({ example: '2025-12-01T14:00:00Z' })
  time: Date;

  @ApiProperty({ example: 5 })
  count: number;
}

export class EventAnalyticsDto {
  @ApiProperty({
    description: 'Check-in rate (percentage)',
    example: 0.75,
  })
  checkInRate: number;

  @ApiProperty({
    description: 'Revenue generated in ETH',
    example: '0.045',
  })
  revenueGenerated: string;

  @ApiProperty({
    description: 'Check-ins by time',
    type: [TimeSeriesDto],
  })
  attendeesByTime: TimeSeriesDto[];

  @ApiPropertyOptional({
    description: 'Additional demographics data',
    example: { newUsers: 10, returningUsers: 35 },
  })
  demographics?: any;
}