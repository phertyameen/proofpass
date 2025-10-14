import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventDto } from 'src/event/dto/event.dto';
import { UserDto } from 'src/user/dto/user.dto';

export class AttendanceDto {
  @ApiProperty({
    description: 'Attendance ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Event ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  eventId: string;

  @ApiProperty({
    description: 'Event details',
    type: () => EventDto,
  })
  event: EventDto;

  @ApiProperty({
    description: 'Attendee ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  attendeeId: string;

  @ApiProperty({
    description: 'Attendee details',
    type: () => UserDto,
  })
  attendee: UserDto;

  @ApiProperty({
    description: 'Transaction hash',
    example: '0x123abc...',
  })
  transactionHash: string;

  @ApiProperty({
    description: 'Block number',
    example: 1234567,
  })
  blockNumber: number;

  @ApiProperty({
    description: 'Check-in timestamp',
    example: '2025-12-01T14:30:00Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'Fee paid in ETH',
    example: '0.001',
  })
  feePaid: string;

  @ApiProperty({
    description: 'Check-in method',
    example: 'QR',
  })
  checkInMethod: string;

  @ApiPropertyOptional({
    description: 'NFT token ID',
    example: 42,
  })
  nftTokenId?: number;

  @ApiPropertyOptional({
    description: 'NFT image URL',
    example: 'https://nft.proofpass.app/42.png',
  })
  nftUrl?: string;

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2025-12-01T14:30:00Z',
  })
  createdAt: Date;
}