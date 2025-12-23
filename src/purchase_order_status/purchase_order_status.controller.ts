import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PurchaseOrderStatusService } from './purchase_order_status.service';
import { CreatePurchaseOrderStatusDTO } from './DTO/CreatePurchaseOrderStatusDTO';

@Controller('{{route-name}}')
export class PurchaseOrderStatusController {
  constructor(private readonly appService: PurchaseOrderStatusService) {}

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
  //async create(@Body() createDto: CreatePurchaseOrderStatusDTO) {
  //  return this.appService.createPurchaseOrderStatus(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deletePurchaseOrderStatus(id);
  }
}
