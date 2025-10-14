import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/attendance/attendance.entity';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { EventModule } from 'src/event/event.module';
import { BlockchainService } from './providers/blockchain.service';
import { EventCreatedListener } from './listeners/event-created.listener';
import { CheckInListener } from './listeners/check-in.listener';
import { Transaction } from 'ethers';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Event, Attendance, Transaction]),
    EventModule,
    AttendanceModule,
  ],
  providers: [BlockchainService, EventCreatedListener, CheckInListener],
  exports: [BlockchainService],
})
export class BlockchainModule {}