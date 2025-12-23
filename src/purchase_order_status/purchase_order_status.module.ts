import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderStatusController } from './purchase_order_status.controller';
import { PurchaseOrderStatusService } from './purchase_order_status.service';
import { PurchaseOrderStatusEntity } from './purchase_order_status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderStatusEntity])],
  controllers: [PurchaseOrderStatusController],
  providers: [PurchaseOrderStatusService],
})
export class PurchaseOrderStatusModule {}
