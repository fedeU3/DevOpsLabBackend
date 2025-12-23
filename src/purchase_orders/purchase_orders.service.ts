import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrdersEntity } from './purchase_orders.entity';
import { CreatePurchaseOrdersDTO } from './DTO/CreatePurchaseOrdersDTO';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrdersEntity)
    private readonly PurchaseOrdersRepository: Repository<PurchaseOrdersEntity>,
  ) {}

  getAll() {
    return this.PurchaseOrdersRepository.find();
  }

  getByName(nombre: string) {
    const item = this.PurchaseOrdersRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.PurchaseOrdersRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createPurchaseOrders(createDto: CreatePurchaseOrdersDTO) {
    const newItem = new PurchaseOrdersEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.PurchaseOrdersRepository.save(newItem);
  }

  async deletePurchaseOrders(id: number): Promise<void> {
    const item = await this.PurchaseOrdersRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.PurchaseOrdersRepository.delete(id);
  }
}
