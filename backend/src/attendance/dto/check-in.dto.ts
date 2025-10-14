import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class CheckInDto {
  @ApiProperty({
    description: 'Database event ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    description: 'Attendee wallet address',
    example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  })
  @IsEthereumAddress()
  walletAddress: string;

  @ApiProperty({
    description: 'Blockchain transaction hash',
    example: '0x123abc...',
  })
  @IsString()
  @IsNotEmpty()
  transactionHash: string;
}