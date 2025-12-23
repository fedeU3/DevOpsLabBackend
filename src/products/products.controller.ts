import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './DTO/CreateProductDTO';

@Controller("Products")
export class ProductsController {
  constructor(private readonly appService: ProductsService ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  getAll() {
    return this.appService.getAll();
  }

  @Get('name/:name')
  async getProductByName(@Param('name') name: string) {
    return this.appService.getByName(name);
  }

  @Get('type/:type')
  async getProductByType(@Param('type') type: string) {
    return this.appService.getByType(type);
  }

  @Post()
  //async createCustomer(@Body() createEquipoDto: CreateCustomersDTO) {
   // return this.appService.createCustomers(createEquipoDto);
 // }


  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteCustomers(id);
  }
}