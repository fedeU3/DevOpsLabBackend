import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProvinciasService } from './provincias.service';

@Controller('provincias')
export class ProvinciasController {
  constructor(private readonly provinciasService: ProvinciasService) { }

  @Get()
  getAll() {
    return this.provinciasService.getAll();
  }

  @Get('name/:name')
  async getByName(@Param('name') name: string) {
    return this.provinciasService.getByName(name);
  }

  @Get('type/:type')
  async getByType(@Param('type') type: string) {
    return this.provinciasService.getByType(type);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.provinciasService.deleteProvincias(id);
  }
}
