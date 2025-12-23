import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryTransactionsEntity } from './Inventory_transactions.entity';
import { CreateInventoryTransactionsDTO } from './DTO/CreateInventoryTransactionsDTO';

@Injectable()
export class InventoryTransactionsService {
  constructor(
    @InjectRepository(InventoryTransactionsEntity)
    private readonly InventoryTransactionsRepository: Repository<InventoryTransactionsEntity>,
  ) {}

  getAll() {
    return this.InventoryTransactionsRepository.find();
  }

  getByName(nombre: string) {
    const item = this.InventoryTransactionsRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.InventoryTransactionsRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  //async create{{EntityName}}(createDto: Create{{EntityName}}DTO) {
    //const newItem = new {{EntityName}}Entity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    //return this.{{entityName}}Repository.save(newItem);
  //}

  async deleteInventoryTransactions(id: number): Promise<void> {
    const item = await this.InventoryTransactionsRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.InventoryTransactionsRepository.delete(id);
  }
}
