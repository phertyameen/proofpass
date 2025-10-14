import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

export class EventDto {
  @ApiProperty({
    description: 'Database ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Blockchain event ID',
    example: 42,
  })
  eventId: number;

  @ApiProperty({
    description: 'Organizer ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  organizerId: string;

  @ApiProperty({
    description: 'Event organizer details',
    type: () => UserDto,
  })
  organizer: UserDto;

  @ApiProperty({
    description: 'Event title',
    example: 'Web3 Workshop: Building on Base',
  })
  title: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Learn how to build decentralized applications on Base L2',
  })
  description: string;

  @ApiProperty({
    description: 'Event location',
    example: 'Virtual / Zoom',
  })
  location: string;

  @ApiProperty({
    description: 'Event start time',
    example: '2025-12-01T14:00:00Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'Event end time',
    example: '2025-12-01T16:00:00Z',
  })
  endTime: Date;

  @ApiProperty({
    description: 'Maximum attendees allowed',
    example: 100,
  })
  maxAttendees: number;

  @ApiProperty({
    description: 'Current number of attendees',
    example: 45,
  })
  currentAttendees: number;

  @ApiProperty({
    description: 'Attendance fee in ETH',
    example: '0.001',
  })
  attendanceFee: string;

  @ApiProperty({
    description: 'Whether event is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Blockchain transaction hash',
    example: '0x123abc...',
  })
  transactionHash: string;

  @ApiProperty({
    description: 'IPFS metadata hash',
    example: 'QmXyz123...',
  })
  metadataHash: string;

  @ApiPropertyOptional({
    description: 'Event banner image URL',
    example: 'https://images.proofpass.app/event123.jpg',
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Event category',
    example: 'Workshop',
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'Event tags',
    example: ['web3', 'blockchain', 'base'],
  })
  tags?: string[];

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-15T10:30:00Z',
  })
  updatedAt: Date;
}