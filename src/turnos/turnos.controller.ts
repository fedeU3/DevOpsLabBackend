import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) { }

  @Get()
  //Trae todos los turnos, si se pasa idServicio filtra por servicio
  getAll(@Query('idServicio') idServicio?: number) {
    return this.turnosService.getAll(idServicio ? Number(idServicio) : undefined);
  }

  // GET /turnos/resumen?desde=2026-10-01&hasta=2026-10-31
  @Get('resumen')
  async getResumen(@Query('desde') desde: string, @Query('hasta') hasta: string) {
    return this.turnosService.getResumen(desde, hasta);
  }

  // GET /turnos/ocupados/1?fecha=2026-10-10
  @Get('ocupados/:idServicio')
  async getHorariosOcupados(
    @Param('idServicio', ParseIntPipe) idServicio: number,
    @Query('fecha') fecha: string,
  ) {
    return this.turnosService.getHorariosOcupados(idServicio, fecha);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.buscarTurno(id);
  }

  @Post()
  async create(@Body() dto: CreateTurnoDto) {
    return this.turnosService.createTurno(dto);
  }

  @Put(':id')
  async replace(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTurnoDto) {
    return this.turnosService.replaceTurno(id, dto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTurnoDto) {
    return this.turnosService.updateTurno(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.deleteTurno(id);
  }
}
