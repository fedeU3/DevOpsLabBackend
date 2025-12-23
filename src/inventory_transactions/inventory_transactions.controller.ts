import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InventoryTransactionsService } from './inventory_transactions.service';
import { CreateInventoryTransactionsDTO } from './DTO/CreateInventoryTransactionsDTO';

@Controller('inventory_transactions')
export class InventoryTransactionsController {
  constructor(private readonly appService: InventoryTransactionsService) {}

  @Get()
  getAll() {
    return this.appService.getAll();
  }

  @Get('name/:name')
  async getByName(@Param('name') name: string) {
    return this.appService.getByName(name);
  }

  @Get('type/:type')
  async getByType(@Param('type') type: string) {
    return this.appService.getByType(type);
  }

  @Post()
  //async create(@Body() createDto: CreateInventoryTransactionsDTO) {
  //return this.appService.createInventoryTransactions(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteInventoryTransactions(id);
  }
}
