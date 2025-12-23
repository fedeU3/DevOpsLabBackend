import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomersDTO } from './DTO/CreateCustomersDTO';

@Controller("customers")
export class CustomersController {
  constructor(private readonly appService: CustomersService ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  getAll() {
    return this.appService.getAll();
  }

  @Get('name/:name')
  async getCustomerByName(@Param('name') name: string) {
    return this.appService.getByName(name);
  }

  @Get('type/:type')
  async getCustomerByType(@Param('type') type: string) {
    return this.appService.getByType(type);
  }

  @Post()
  //async createCustomer(@Body() createEquipoDto: CreateCustomersDTO) {
   // return this.appService.createCustomers(createEquipoDto);
 // }


  @Delete(':id')
  async deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteCustomers(id);
  }
}
