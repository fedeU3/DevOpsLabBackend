import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { SalesReportsService } from './sales_reports.service';
import { CreateSalesReportsDTO } from './DTO/CreateSalesReportsDTO';

@Controller('SalesReports')
export class SalesReportsController {
  constructor(private readonly appService: SalesReportsService) {}

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
  //async create(@Body() createDto: CreateSalesReportsDTO) {
  //  return this.appService.createSalesReports(createDto);
  //}

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteSalesReports(id);
  }
}
