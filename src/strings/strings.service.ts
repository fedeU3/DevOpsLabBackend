import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StringsEntity } from './strings.entity';
import { CreateStringsDTO } from './DTO/CreateStringsDTO';

@Injectable()
export class StringsService {
  constructor(
    @InjectRepository(StringsEntity)
    private readonly StringsRepository: Repository<StringsEntity>,
  ) {}

  getAll() {
    return this.StringsRepository.find();
  }

  getByName(nombre: string) {
    const item = this.StringsRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.StringsRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createStrings(createDto: CreateStringsDTO) {
    const newItem = new StringsEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.StringsRepository.save(newItem);
  }

  async deleteStrings(id: number): Promise<void> {
    const item = await this.StringsRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.StringsRepository.delete(id);
  }
}
