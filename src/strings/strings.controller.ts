import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { StringsService } from './strings.service';
import { CreateStringsDTO } from './DTO/CreateStringsDTO';

@Controller('Strings')
export class StringsController {
  constructor(private readonly appService: StringsService) {}

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
  //async create(@Body() createDto: CreateStringsDTO) {
  //  return this.appService.createStrings(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteStrings(id);
  }
}
