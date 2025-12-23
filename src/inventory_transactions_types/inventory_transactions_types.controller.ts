import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InventoryTransactionsTypesService } from './inventory_transactions_types.service'
import { CreateInventoryTransactionsTypesDTO } from './DTO/CreateInventoryTransactionsTypesDTO';

@Controller('Inventory_transactions_types')
export class InventoryTransactionsTypesController {
  constructor(private readonly appService: InventoryTransactionsTypesService) {}

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
  //async create(@Body() createDto: CreateInventoryTransactionsTypesDTO) {
  //  return this.appService.createInventoryTransactionsTypes(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteInventoryTransactionsTypes(id);
  }
}
