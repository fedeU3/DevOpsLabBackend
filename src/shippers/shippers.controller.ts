import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ShippersService } from './shippers.service';
import { CreateShippersDTO } from './DTO/CreateShippersDTO';

@Controller('Shippers')
export class ShippersController {
  constructor(private readonly appService: ShippersService) {}

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
  //async create(@Body() createDto: CreateShippersDTO) {
  //  return this.appService.createShippers(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteShippers(id);
  }
}
