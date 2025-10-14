import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  })
  walletAddress: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@proofpass.app',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Display name',
    example: 'John Doe',
  })
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Avatar image URL',
    example: 'https://avatars.example.com/user123.jpg',
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'Whether user is an event organizer',
    example: true,
  })
  isOrganizer: boolean;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2025-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-15T10:30:00Z',
  })
  updatedAt: Date;
}