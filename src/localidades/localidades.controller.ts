import { Controller, Get, Param } from '@nestjs/common';
import { LocalidadesService } from './localidades.service';

@Controller('localidades')
export class LocalidadesController {
  constructor(private readonly localidadesService: LocalidadesService) { }

  @Get()
  getAll() {
    return this.localidadesService.getAll();
  }

  @Get('name/:name')
  async getByName(@Param('name') name: string) {
    return this.localidadesService.getByName(name);
  }

  @Get('type/:type')
  async getByType(@Param('type') type: string) {
    return this.localidadesService.getByType(type);
  }

}
