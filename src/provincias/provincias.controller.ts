import { Controller, Get, Param } from '@nestjs/common';
import { ProvinciasService } from './provincias.service';

@Controller('provincias')
export class ProvinciasController {
  constructor(private readonly provinciasService: ProvinciasService) {}

  @Get()
  getAll() {
    return this.provinciasService.getAll();
  }

  @Get('name/:name')
  getByName(@Param('name') name: string) {
    return this.provinciasService.getByName(name);
  }
}
