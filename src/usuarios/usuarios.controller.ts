import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';


@Controller("usuarios")
export class UsuariosController {
  constructor(private readonly appService: UsuariosService) { }

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
  async createCustomer(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.appService.createUsuario(createUsuarioDto);
  }


  @Patch(':id/password')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.appService.changePassword(id, changePasswordDto);
  }

  /*@Delete(':id')
  async deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteUsuario(id);
  }*/
}
