import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalidadesEntity } from './localidades.entity';

@Injectable()
export class LocalidadesService {
  constructor(
    @InjectRepository(LocalidadesEntity)
    private readonly localidadesRepository: Repository<LocalidadesEntity>,
  ) { }

  getAll() {
    return this.localidadesRepository.find();
  }

  getByName(nombre: string) {
    /*     const item = this.localidadesRepository.find({
          where: { nombre: ILike(`%${nombre}%`) },
        });
    
        if (!nombre) {
          throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
        }
    
        return item; */
  }

  getByType(tipo: string) {
    /*     const item = this.localidadesRepository.find({
          where: { tipo: ILike(`%${tipo}%`) },
        });
    
        if (!item) {
          throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
        }
    
        return item; */
  }

  async deleteLocalidad(id: number): Promise<void> {
    /*     const item = await this.localidadesRepository.findOneBy({ id });
        if (!item) {
          throw new NotFoundException(`Elemento con id ${id} no encontrado`);
        }
        await this.localidadesRepository.delete(id);
        */
  }


}
