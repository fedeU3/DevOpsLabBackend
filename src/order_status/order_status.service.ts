import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatusEntity } from './order_status.entity';
import { CreateOrderStatusDTO } from './DTO/CreateOrderStatusDTO';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectRepository(OrderStatusEntity)
    private readonly OrderStatusRepository: Repository<OrderStatusEntity>,
  ) {}

  getAll() {
    return this.OrderStatusRepository.find();
  }

  getByName(nombre: string) {
    const item = this.OrderStatusRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.OrderStatusRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createOrderStatus(createDto: CreateOrderStatusDTO) {
    const newItem = new OrderStatusEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.OrderStatusRepository.save(newItem);
  }

  async deleteOrderStatus(id: number): Promise<void> {
    const item = await this.OrderStatusRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.OrderStatusRepository.delete(id);
  }
}
