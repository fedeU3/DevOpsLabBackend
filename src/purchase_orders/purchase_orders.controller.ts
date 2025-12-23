import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase_orders.service';
import { CreatePurchaseOrdersDTO } from './DTO/CreatePurchaseOrdersDTO';

@Controller('PurchaseOrders')
export class PurchaseOrdersController {
  constructor(private readonly appService: PurchaseOrdersService) {}

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
  //async create(@Body() createDto: CreatePurchaseOrdersDTO) {
  //  return this.appService.createPurchaseOrders(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deletePurchaseOrders(id);
  }
}
