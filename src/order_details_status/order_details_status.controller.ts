import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { OrderDetailsStatusService } from './order_details_status.service';
import { CreateOrderDetailsStatusDTO } from './DTO/CreateOrderDetailsStatusDTO';

@Controller('{{route-name}}')
export class OrderDetailsStatusController {
  constructor(private readonly appService: OrderDetailsStatusService) {}

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
  //async create(@Body() createDto: CreateOrderDetailsStatusDTO) {
  //  return this.appService.createOrderDetailsStatus(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteOrderDetailsStatus(id);
  }
}
