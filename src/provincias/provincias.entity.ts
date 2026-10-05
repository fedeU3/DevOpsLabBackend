import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Provincias' })
export class ProvinciasEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'IdProvincia' })
  idProvincia: number;

  @Column({ type: 'varchar', name: 'Provincia', length: 20 })
  provincia: string;
}
