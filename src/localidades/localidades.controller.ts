import { Controller, Get, Param } from '@nestjs/common';
import { LocalidadesService } from './localidades.service';

@Controller('localidades')
export class LocalidadesController {
  constructor(private readonly localidadesService: LocalidadesService) {}

  @Get()
  getAll() {
    return this.localidadesService.getAll();
  }

  @Get('name/:name')
  getByName(@Param('name') name: string) {
    return this.localidadesService.getByName(name);
  }
}
