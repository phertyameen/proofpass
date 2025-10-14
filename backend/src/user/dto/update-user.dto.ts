import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email address',
    example: 'newemail@proofpass.app',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Display name',
    example: 'Jane Doe',
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: 'https://avatars.example.com/newavatar.jpg',
  })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}