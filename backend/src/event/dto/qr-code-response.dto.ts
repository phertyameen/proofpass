import { ApiProperty } from '@nestjs/swagger';

export class QRCodeResponseDto {
  @ApiProperty({
    description: 'QR code data (event ID)',
    example: 'proofpass://check-in/42',
  })
  qrCodeData: string;

  @ApiProperty({
    description: 'QR code image URL (base64 or hosted)',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
  })
  qrCodeUrl: string;
}