import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifySignatureDto } from './dto/verify-signature.dto';
import {
  // ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NonceResponseDto } from './dto/nonce-response.dto';
import { NonceRequestDto } from './dto/nonce-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from 'src/user/dto/user.dto';
// import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Step 1: Generate nonce
  @Post('nonce')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get nonce for wallet authentication',
    description: 'Generate a unique nonce for the wallet address to sign',
  })
  @ApiBody({ type: NonceRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Nonce generated successfully',
    type: NonceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid wallet address' })
  async getNonce(@Body('walletAddress') walletAddress: string) {
    const nonce = await this.authService.generateNonce(walletAddress);
    return { nonce };
  }

  // Step 2: Verify signature and return JWT
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify signature and get JWT token',
    description: 'Verify wallet signature and receive authentication token',
  })
  @ApiBody({ type: VerifySignatureDto })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid signature or nonce' })
  async verify(@Body() dto: VerifySignatureDto): Promise<AuthResponseDto> {
    const { walletAddress, signature, nonce } = dto;

    // Verify signature
    const isValid = await this.authService.verifySignature(
      walletAddress,
      signature,
      nonce,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Generate JWT token
    const { accessToken, user } = await this.authService.login(walletAddress);

    return { accessToken, user };
  }

  // Get current user (protected route)
  @Get('me')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Retrieve authenticated user information',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Request() req: any): Promise<UserResponseDto> {
    return req.user;
  }
}
