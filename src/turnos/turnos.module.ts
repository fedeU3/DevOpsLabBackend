import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';
import { TurnosEntity } from './turnos.entity';
import { ServiciosModule } from '../servicios/servicios.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([TurnosEntity]), ServiciosModule, UsuariosModule],
  controllers: [TurnosController],
  providers: [TurnosService],
})
export class TurnosModule { }
