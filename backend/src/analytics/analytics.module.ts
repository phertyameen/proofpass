import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytics } from './analytics.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Analytics])]
})
export class AnalyticsModule {}
