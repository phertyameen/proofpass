import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { randomBytes } from 'crypto';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Generate random nonce for user
  async generateNonce(walletAddress: string): Promise<string> {
    const nonce = randomBytes(32).toString('hex');

    // Find or create user
    let user = await this.userRepository.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      user = this.userRepository.create({
        walletAddress: walletAddress.toLowerCase(),
      });
    }

    // Store nonce (expires in 5 minutes)
    user.nonce = nonce;
    await this.userRepository.save(user);

    return nonce;
  }

  // Verify wallet signature
  async verifySignature(
    walletAddress: string,
    signature: string,
    nonce: string,
  ): Promise<boolean> {
    try {
      // Get user and verify nonce
      const user = await this.userRepository.findOne({
        where: { walletAddress: walletAddress.toLowerCase() },
      });

      if (!user || user.nonce !== nonce) {
        return false;
      }

      // Recreate the message that was signed
      const message = `Sign this message to authenticate with ProofPass.\n\nWallet: ${walletAddress}\nNonce: ${nonce}`;

      // Verify signature using ethers.js
      const recoveredAddress = ethers.verifyMessage(message, signature);

      // Check if recovered address matches claimed address
      const isValid =
        recoveredAddress.toLowerCase() === walletAddress.toLowerCase();

      if (isValid) {
        // Clear nonce after successful verification
        user.nonce = null;
        await this.userRepository.save(user);
      }

      return isValid;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  // Generate JWT token
  async login(walletAddress: string) {
    const user = await this.userRepository.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Create JWT payload
    const payload = {
      sub: user.id,
      walletAddress: user.walletAddress,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        isOrganizer: user.isOrganizer,
      },
    };
  }

  // Validate JWT and return user
  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException('Invalid token: user not found');
    return user;
  }
}
