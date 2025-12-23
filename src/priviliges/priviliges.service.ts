import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PriviligesEntity } from './priviliges.entity';
import { CreatePriviligesDTO } from './DTO/CreatePriviligesDTO';

@Injectable()
export class PriviligesService {
  constructor(
    @InjectRepository(PriviligesEntity)
    private readonly PriviligesRepository: Repository<PriviligesEntity>,
  ) {}

  getAll() {
    return this.PriviligesRepository.find();
  }

  getByName(nombre: string) {
    const item = this.PriviligesRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.PriviligesRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createPriviliges(createDto: CreatePriviligesDTO) {
    const newItem = new PriviligesEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.PriviligesRepository.save(newItem);
  }

  async deletePriviliges(id: number): Promise<void> {
    const item = await this.PriviligesRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.PriviligesRepository.delete(id);
  }
}
