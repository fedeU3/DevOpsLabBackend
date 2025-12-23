import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeesDTO } from './DTO/CreateEmployeesDTO';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly appService: EmployeesService) {}

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
  //async create(@Body() createDto: CreateEmployeesDTO) {
  //  return this.appService.createEmployees(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteEmployees(id);
  }
}
