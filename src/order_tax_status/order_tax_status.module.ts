import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTaxStatusController } from './order_tax_status.controller';
import { OrderTaxStatusService } from './order_tax_status.service';
import { OrderTaxStatusEntity } from './order_tax_status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderTaxStatusEntity])],
  controllers: [OrderTaxStatusController],
  providers: [OrderTaxStatusService],
})
export class OrderTaxStatusModule {}
