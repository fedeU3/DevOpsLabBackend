import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { {{EntityName}}Entity } from './{{entityName}}.entity';
import { Create{{EntityName}}DTO } from './DTO/Create{{EntityName}}DTO';

@Injectable()
export class {{EntityName}}Service {
  constructor(
    @InjectRepository({{EntityName}}Entity)
    private readonly {{entityName}}Repository: Repository<{{EntityName}}Entity>,
  ) {}

  getAll() {
    return this.{{entityName}}Repository.find();
  }

  getByName(nombre: string) {
    const item = this.{{entityName}}Repository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.{{entityName}}Repository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async create{{EntityName}}(createDto: Create{{EntityName}}DTO) {
    const newItem = new {{EntityName}}Entity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.{{entityName}}Repository.save(newItem);
  }

  async delete{{EntityName}}(id: number): Promise<void> {
    const item = await this.{{entityName}}Repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.{{entityName}}Repository.delete(id);
  }
}
