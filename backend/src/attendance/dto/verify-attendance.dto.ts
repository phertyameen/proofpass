import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyAttendanceDto {
  @ApiProperty({
    description: 'Whether attendance is verified',
    example: true,
  })
  attended: boolean;

  @ApiPropertyOptional({
    description: 'Check-in timestamp (if attended)',
    example: '2025-12-01T14:30:00Z',
  })
  timestamp?: Date;

  @ApiPropertyOptional({
    description: 'Transaction hash (if attended)',
    example: '0x123abc...',
  })
  transactionHash?: string;
}