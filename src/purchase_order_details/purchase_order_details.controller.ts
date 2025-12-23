import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PurchaseOrderDetailsService } from './purchase_order_details.service';
import { CreatePurchaseOrderDetailsDTO } from './DTO/CreatePurchaseOrderDetailsDTO';

@Controller('PurchaseOrderDetails')
export class PurchaseOrderDetailsController {
  constructor(private readonly appService: PurchaseOrderDetailsService) {}

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
  //async create(@Body() createDto: CreatePurchaseOrderDetailsDTO) {
  //  return this.appService.createPurchaseOrderDetails(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deletePurchaseOrderDetails(id);
  }
}
