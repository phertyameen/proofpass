import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  IsUrl,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateEventDto {
  @ApiProperty({
    description: 'Title of the event',
    example: 'Base Developers Meetup',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of what the event is about',
    example:
      'A meetup for Base developers to discuss network upgrades and tooling.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Physical or virtual location of the event',
    example: 'Argentina Tech Hub, Nigeria',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'ISO 8601 formatted start date and time of the event',
    example: '2025-11-20T09:00:00Z',
  })
  @IsDateString()
  startTime: Date;

  @ApiProperty({
    description: 'ISO 8601 formatted end date and time of the event',
    example: '2025-11-20T17:00:00Z',
  })
  @IsDateString()
  endTime: Date;

  @ApiPropertyOptional({
    description: 'Timezone',
    example: 'America/New_York',
    default: 'UTC',
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({
    description: 'Maximum number of attendees allowed for the event',
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  maxAttendees: number;

  @ApiProperty({
    description: 'Event attendance fee in ETH (as a string)',
    example: '0.02',
  })
  @IsString()
  @IsNotEmpty()
  attendanceFee: string;

  @ApiPropertyOptional({
    description: 'Optional image URL representing the event (poster or banner)',
    example: 'https://example.com/images/eth-meetup-banner.png',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Event category',
    example: 'Workshop',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Event tags',
    example: ['web3', 'blockchain', 'base'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
