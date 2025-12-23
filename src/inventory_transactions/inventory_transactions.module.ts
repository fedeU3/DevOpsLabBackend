import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryTransactionsController } from './inventory_transactions.controller';
import { InventoryTransactionsService } from './inventory_transactions.service';
import { InventoryTransactionsEntity } from './Inventory_transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryTransactionsEntity])],
  controllers: [InventoryTransactionsController],
  providers: [InventoryTransactionsService],
})
export class InventoryTransactionsModule {}
