import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('appConfig.secret') || 
                      configService.get<string>('JWT_SECRET') || 
                      'fallback-dev-secret';
        
        const expiresIn = parseInt(
          configService.get<string>('appConfig.expire') || 
          configService.get<string>('JWT_EXPIRY') || 
          '86400',
          10,
        );

        console.log('🔑 JWT Module Config:', { 
          secret: secret ? '✅ Secret loaded' : '❌ No secret', 
          expiresIn 
        });

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
