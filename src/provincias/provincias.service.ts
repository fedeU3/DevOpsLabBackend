import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvinciasEntity } from './provincias.entity';
/* import { CreateInvoicesDTO } from './DTO/CreateInvoicesDTO'; */

@Injectable()
export class ProvinciasService {
  constructor(
    @InjectRepository(ProvinciasEntity)
    private readonly provinciasRepository: Repository<ProvinciasEntity>,
  ) { }

  getAll() {
    return this.provinciasRepository.find();
  }

  getByName(nombre: string) {
    /*     const item = this.provinciasRepository.find({
          where: { nombre: ILike(`%${nombre}%`) },
        });
    
        if (!nombre) {
          throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
        }
    
        return item; */
  }

  getByType(tipo: string) {
    /*     const item = this.provinciasRepository.find({
          where: { tipo: ILike(`%${tipo}%`) },
        });
    
        if (!item) {
          throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
        }
    
        return item; */
  }

  async deleteProvincias(id: number): Promise<void> {
    /*     const item = await this.provinciasRepository.findOneBy({ id });
        if (!item) {
          throw new NotFoundException(`Elemento con id ${id} no encontrado`);
        }
        await this.provinciasRepository.delete(id); */
  }
}
