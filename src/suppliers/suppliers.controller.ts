import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { {{EntityName}}Service } from './{{entityName}}.service';
import { Create{{EntityName}}DTO } from './DTO/Create{{EntityName}}DTO';

@Controller('{{route-name}}')
export class {{EntityName}}Controller {
  constructor(private readonly appService: {{EntityName}}Service) {}

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
  async create(@Body() createDto: Create{{EntityName}}DTO) {
    return this.appService.create{{EntityName}}(createDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.delete{{EntityName}}(id);
  }
}
