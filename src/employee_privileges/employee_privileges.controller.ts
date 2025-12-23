import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EmployeePrivilegesService } from './employee_privileges.service';
import { CreateEmployeePrivilegesDTO } from './DTO/CreateEmployeePrivilegesDTO';

@Controller('{{route-name}}')
export class EmployeePrivilegesController {
  constructor(private readonly appService: EmployeePrivilegesService) {}

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
  //async create(@Body() createDto: CreateEmployeePrivilegesDTO) {
  //  return this.appService.createEmployeePrivileges(createDto);
 // }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteEmployeePrivileges(id);
  }
}