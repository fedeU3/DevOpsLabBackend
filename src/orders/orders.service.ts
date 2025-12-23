import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from './orders.entity';
import { CreateOrdersDTO } from './DTO/CreateOrdersDTO';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly OrdersRepository: Repository<OrdersEntity>,
  ) {}

  getAll() {
    return this.OrdersRepository.find();
  }

  getByName(nombre: string) {
    const item = this.OrdersRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.OrdersRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createOrders(createDto: CreateOrdersDTO) {
    const newItem = new OrdersEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.OrdersRepository.save(newItem);
  }

  async deleteOrders(id: number): Promise<void> {
    const item = await this.OrdersRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.OrdersRepository.delete(id);
  }
}
