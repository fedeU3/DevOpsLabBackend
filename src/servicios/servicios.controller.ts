import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) { }

  @Get()
  getAll() {
    return this.serviciosService.getAll();
  }

  @Get('nombre/:nombre')
  async getByNombre(@Param('nombre') nombre: string) {
    return this.serviciosService.getByNombre(nombre);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.buscarServicio(id);
  }

  @Post()
  async create(@Body() dto: CreateServicioDto) {
    return this.serviciosService.createServicio(dto);
  }

  @Put(':id')
  async replace(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateServicioDto) {
    return this.serviciosService.replaceServicio(id, dto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServicioDto) {
    return this.serviciosService.updateServicio(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.deleteServicio(id);
  }
}
