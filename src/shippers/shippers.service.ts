import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippersEntity } from './shippers.entity';
import { CreateShippersDTO } from './DTO/CreateShippersDTO';

@Injectable()
export class ShippersService {
  constructor(
    @InjectRepository(ShippersEntity)
    private readonly ShippersRepository: Repository<ShippersEntity>,
  ) {}

  getAll() {
    return this.ShippersRepository.find();
  }

  getByName(nombre: string) {
    const item = this.ShippersRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.ShippersRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createShippers(createDto: CreateShippersDTO) {
    const newItem = new ShippersEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.ShippersRepository.save(newItem);
  }

  async deleteShippers(id: number): Promise<void> {
    const item = await this.ShippersRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.ShippersRepository.delete(id);
  }
}
