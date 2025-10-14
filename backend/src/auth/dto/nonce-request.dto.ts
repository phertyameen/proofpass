import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress } from 'class-validator';

export class NonceRequestDto {
  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  })
  @IsEthereumAddress()
  walletAddress: string;
}