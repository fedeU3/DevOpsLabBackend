import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsuariosEntity } from '../usuarios/usuarios.entity';
import { ServiciosEntity } from '../servicios/servicios.entity';

@Entity({ name: 'Turnos' })
export class TurnosEntity {
  @PrimaryGeneratedColumn({ name: 'IdTurno', type: 'int' })
  idTurno: number;

  // =========================
  // FKs (ids)
  // =========================

  @Column({ name: 'IdUsuario', type: 'int' })
  idUsuario: number;

  @Column({ name: 'IdServicio', type: 'int' })
  idServicio: number;

  // =========================
  // Campos
  // =========================

  // Fecha y hora de inicio. El fin se calcula con la duracion del servicio.
  @Column('timestamp', { name: 'Fecha' })
  fecha: Date;

  // P = Pendiente, A = Atendido, C = Cancelado
  @Column('char', { name: 'Estado', length: 1 })
  estado: string;

  // =========================
  // Relaciones
  // =========================

  @ManyToOne(() => UsuariosEntity)
  @JoinColumn({ name: 'IdUsuario' })
  usuario: UsuariosEntity;

  @ManyToOne(() => ServiciosEntity)
  @JoinColumn({ name: 'IdServicio' })
  servicio: ServiciosEntity;
}
