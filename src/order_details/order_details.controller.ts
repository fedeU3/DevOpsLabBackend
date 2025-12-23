import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { CreateOrderDetailsDTO } from './DTO/CreateOrderDetailsDTO';

@Controller('order_details')
export class OrderDetailsController {
  constructor(private readonly appService: OrderDetailsService) {}

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
  //async create(@Body() createDto: CreateOrderDetailsDTO) {
  // return this.appService.createOrderDetails(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteOrderDetails(id);
  }
}
