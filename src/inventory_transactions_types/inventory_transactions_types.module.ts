import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryTransactionsTypesController } from './inventory_transactions_types.controller';
import { InventoryTransactionsTypesService } from './inventory_transactions_types.service';
import { InventoryTransactionsTypesEntity } from './inventory_transactions_types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryTransactionsTypesEntity])],
  controllers: [InventoryTransactionsTypesController],
  providers: [InventoryTransactionsTypesService],
})
export class InventoryTransactionsTypesModule {}
