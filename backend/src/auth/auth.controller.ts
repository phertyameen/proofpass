import { Controller, Post, Get, Body, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifySignatureDto } from './dto/verify-signature.dto';
// import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Step 1: Generate nonce
  @Post('nonce')
  async getNonce(@Body('walletAddress') walletAddress: string) {
    const nonce = await this.authService.generateNonce(walletAddress);
    return { nonce };
  }

  // Step 2: Verify signature and return JWT
  @Post('verify')
  async verify(@Body() dto: VerifySignatureDto) {
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
//   @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req: any) {
    return req.user;
  }
}