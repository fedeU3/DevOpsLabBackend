import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Servicios' })
export class ServiciosEntity {
  @PrimaryGeneratedColumn({ name: 'IdServicio', type: 'int' })
  idServicio: number;

  @Column('varchar', { name: 'Servicio', length: 60 })
  servicio: string;

  // Duracion del turno en minutos
  @Column('int', { name: 'Duracion' })
  duracion: number;

  @Column('decimal', { name: 'Precio', precision: 15, scale: 2 })
  precio: number;

  // A = Activo, B = Baja
  @Column('char', { name: 'Estado', length: 1 })
  estado: string;
}
