import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LocalidadesEntity } from '../localidades/localidades.entity';
import { ProvinciasEntity } from '../provincias/provincias.entity';

@Entity({ name: 'Usuarios' })
export class UsuariosEntity {
  @PrimaryGeneratedColumn({ name: 'IdUsuario', type: 'int' })
  idUsuario: number;

  // =========================
  // FKs (ids)
  // =========================

  @Column({ name: 'IdLocalidad', type: 'int' })
  idLocalidad: number;

  @Column({ name: 'IdProvincia', type: 'int' })
  idProvincia: number;

  // =========================
  // Campos
  // =========================

  @Column('varchar', { name: 'Usuario', length: 30 })
  usuario: string;

  @Column('char', { name: 'Password', length: 60 })
  password: string;

  @Column('varchar', { name: 'Token', length: 512 })
  token: string;

  @Column('char', { name: 'Estado', length: 1 })
  estado: string;

  @Column('varchar', { name: 'Nombres', length: 30 })
  nombres: string;

  @Column('varchar', { name: 'Apellidos', length: 30 })
  apellidos: string;

  @Column('varchar', { name: 'Telefono', length: 20 })
  telefono: string;

  @Column('char', { name: 'DNI', length: 8 })
  dni: string;

  @Column('char', { name: 'CUIL', length: 11 })
  cuil: string;

  @Column('varchar', { name: 'Email', length: 120 })
  email: string;

  @Column('date', { name: 'FechaAlta' })
  fechaAlta: Date;

  @Column('varchar', { name: 'Calle', length: 120 })
  calle: string;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => LocalidadesEntity)
  @JoinColumn({ name: 'IdLocalidad' })
  localidad: LocalidadesEntity;

  @ManyToOne(() => ProvinciasEntity)
  @JoinColumn({ name: 'IdProvincia' })
  provincia: ProvinciasEntity;
}
