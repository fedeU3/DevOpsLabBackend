import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosEntity } from './usuarios.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(UsuariosEntity)
    private readonly UsuariosRepository: Repository<UsuariosEntity>,
  ) { }
  getHello(): string {
    return 'Hello World!';
  }

  getAll() {
    return this.UsuariosRepository.find();
  }


  getByName(nombre: string) {
    const equipo = this.UsuariosRepository.find({
      where: { nombres: ILike(`%${nombre}%`) },
    })

    if (!nombre) {
      throw new NotFoundException(`Equipo con ID ${nombre} no encontrado`);
    }

    return equipo;
  }

  getByType(tipo: string) {
    const equipo = this.UsuariosRepository.find({
      //where: { tipo: ILike(`%${tipo}%`) },
    })

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${tipo} no encontrado`);
    }

    return equipo;
  }

  getById(id: number) {
    return this.UsuariosRepository.findOne({
      where: { idUsuario: id }
    });
  }

  getByUserName(usuario: string) {
    return this.UsuariosRepository.findOne({
      where: { usuario }
    });
  }

  async updateToken(id: number, token: string): Promise<void> {
    await this.UsuariosRepository.update({ idUsuario: id }, { token });
  }

  async createUsuario(createUsuarioDto: CreateUsuarioDto) {
    const usuarios = new UsuariosEntity();

    usuarios.usuario = createUsuarioDto.usuario;
    usuarios.password = createUsuarioDto.password;
    usuarios.estado = createUsuarioDto.estado;
    usuarios.nombres = createUsuarioDto.nombres;
    usuarios.apellidos = createUsuarioDto.apellidos;
    usuarios.telefono = createUsuarioDto.telefono;
    usuarios.dni = createUsuarioDto.dni;
    usuarios.cuil = createUsuarioDto.cuil;
    usuarios.email = createUsuarioDto.email;
    usuarios.fechaAlta = new Date();
    usuarios.calle = createUsuarioDto.calle;
    usuarios.idLocalidad = createUsuarioDto.idLocalidad;
    usuarios.idProvincia = createUsuarioDto.idProvincia;

    return this.UsuariosRepository.save(usuarios);
  }

  async changePassword(id: number, dto: ChangePasswordDto): Promise<void> {
    const usuario = await this.UsuariosRepository.findOne({ where: { idUsuario: id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const passwordMatch = await bcrypt.compare(dto.passwordActual, usuario.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    const hashedPassword = await bcrypt.hash(dto.passwordNueva, 10);
    await this.UsuariosRepository.update({ idUsuario: id }, { password: hashedPassword });
  }

  /*async deleteUsuario(id: number): Promise<void> {
    const usuarios = await this.UsuariosRepository.findOneBy({ idUsuario: id });
    if (!usuarios) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    await this.UsuariosRepository.delete(id);
  }*/
}
