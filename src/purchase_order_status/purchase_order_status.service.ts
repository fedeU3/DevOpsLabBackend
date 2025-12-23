import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderStatusEntity } from './purchase_order_status.entity';
import { CreatePurchaseOrderStatusDTO } from './DTO/CreatePurchaseOrderStatusDTO';

@Injectable()
export class PurchaseOrderStatusService {
  constructor(
    @InjectRepository(PurchaseOrderStatusEntity)
    private readonly PurchaseOrderStatusRepository: Repository<PurchaseOrderStatusEntity>,
  ) {}

  getAll() {
    return this.PurchaseOrderStatusRepository.find();
  }

  getByName(nombre: string) {
    const item = this.PurchaseOrderStatusRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.PurchaseOrderStatusRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createPurchaseOrderStatus(createDto: CreatePurchaseOrderStatusDTO) {
    const newItem = new PurchaseOrderStatusEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.PurchaseOrderStatusRepository.save(newItem);
  }

  async deletePurchaseOrderStatus(id: number): Promise<void> {
    const item = await this.PurchaseOrderStatusRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.PurchaseOrderStatusRepository.delete(id);
  }
}