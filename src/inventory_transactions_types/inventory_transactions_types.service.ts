import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryTransactionsTypesEntity } from './inventory_transactions_types.entity';
import { CreateInventoryTransactionsTypesDTO } from './DTO/CreateInventoryTransactionsTypesDTO';

@Injectable()
export class InventoryTransactionsTypesService {
  constructor(
    @InjectRepository(InventoryTransactionsTypesEntity)
    private readonly InventoryTransactionsTypesRepository: Repository<InventoryTransactionsTypesEntity>,
  ) {}

  getAll() {
    return this.InventoryTransactionsTypesRepository.find();
  }

  getByName(nombre: string) {
    const item = this.InventoryTransactionsTypesRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.InventoryTransactionsTypesRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createInventoryTransactionsTypes(createDto: CreateInventoryTransactionsTypesDTO) {
    const newItem = new InventoryTransactionsTypesEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.InventoryTransactionsTypesRepository.save(newItem);
  }

  async deleteInventoryTransactionsTypes(id: number): Promise<void> {
    const item = await this.InventoryTransactionsTypesRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.InventoryTransactionsTypesRepository.delete(id);
  }
}
