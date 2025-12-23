import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { OrderTaxStatusService } from './order_tax_status.service';
import { CreateOrderTaxStatusDTO } from './DTO/CreateOrderTaxStatusDTO';

@Controller('OrderTaxStatus')
export class OrderTaxStatusController {
  constructor(private readonly appService: OrderTaxStatusService) {}

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
  //async create(@Body() createDto: CreateOrderTaxStatusDTO) {
   // return this.appService.createOrderTaxStatus(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteOrderTaxStatus(id);
  }
}
