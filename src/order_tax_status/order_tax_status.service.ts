import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTaxStatusEntity } from './order_tax_status.entity';
import { CreateOrderTaxStatusDTO } from './DTO/CreateOrderTaxStatusDTO';

@Injectable()
export class OrderTaxStatusService {
  constructor(
    @InjectRepository(OrderTaxStatusEntity)
    private readonly OrderTaxStatusRepository: Repository<OrderTaxStatusEntity>,
  ) {}

  getAll() {
    return this.OrderTaxStatusRepository.find();
  }

  getByName(nombre: string) {
    const item = this.OrderTaxStatusRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.OrderTaxStatusRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createOrderTaxStatus(createDto: CreateOrderTaxStatusDTO) {
    const newItem = new OrderTaxStatusEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.OrderTaxStatusRepository.save(newItem);
  }

  async deleteOrderTaxStatus(id: number): Promise<void> {
    const item = await this.OrderTaxStatusRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.OrderTaxStatusRepository.delete(id);
  }
}
