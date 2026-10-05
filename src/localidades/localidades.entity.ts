import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Localidades' })
export class LocalidadesEntity {
  // PK en DB: "IdLocalidad" (autoincrement)
  @PrimaryGeneratedColumn({ name: 'IdLocalidad', type: 'int' })
  idLocalidad: number;

  // Columna en DB: si se llama distinto (p. ej. "Localidad"), agregá name: 'Localidad'
  @Column('varchar', { name: 'Localidad', length: 100 })
  localidad: string;
}