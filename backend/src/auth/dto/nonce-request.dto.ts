import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsOptional, IsString } from 'class-validator';

export class NonceRequestDto {
  @ApiProperty({
    description: 'Farcaster ID',
    example: '12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  fid?: string;

  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  })
  @IsEthereumAddress()
  walletAddress: string;
}
