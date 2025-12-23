import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesReportsController } from './sales_reports.controller';
import { SalesReportsService } from './sales_reports.service';
import { SalesReportsEntity } from './sales_reports.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesReportsEntity])],
  controllers: [SalesReportsController],
  providers: [SalesReportsService],
})
export class SalesReportsModule {}
