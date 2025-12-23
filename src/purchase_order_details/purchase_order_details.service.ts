import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderDetailsEntity } from './purchase_orders_details.entity';
import { CreatePurchaseOrderDetailsDTO } from './DTO/CreatePurchaseOrderDetailsDTO';

@Injectable()
export class PurchaseOrderDetailsService {
  constructor(
    @InjectRepository(PurchaseOrderDetailsEntity)
    private readonly PurchaseOrderDetailsRepository: Repository<PurchaseOrderDetailsEntity>,
  ) {}

  getAll() {
    return this.PurchaseOrderDetailsRepository.find();
  }

  getByName(nombre: string) {
    const item = this.PurchaseOrderDetailsRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.PurchaseOrderDetailsRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createPurchaseOrderDetails(createDto: CreatePurchaseOrderDetailsDTO) {
    const newItem = new PurchaseOrderDetailsEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.PurchaseOrderDetailsRepository.save(newItem);
  }

  async deletePurchaseOrderDetails(id: number): Promise<void> {
    const item = await this.PurchaseOrderDetailsRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.PurchaseOrderDetailsRepository.delete(id);
  }
}
