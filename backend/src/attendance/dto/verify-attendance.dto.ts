import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

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
  @IsOptional()
  timestamp?: Date;

  @ApiPropertyOptional({
    description: 'Transaction hash (if attended)',
    example: '0x123abc...',
  })
  @IsOptional()
  transactionHash?: string;

  @ApiProperty({ example: 'QR', required: false })
  @IsOptional()
  checkInMethod?: string;
}