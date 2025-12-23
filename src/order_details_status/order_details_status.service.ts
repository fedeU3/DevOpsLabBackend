import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailsStatusEntity } from './order_details_status.entity';
import { CreateOrderDetailsStatusDTO } from './DTO/CreateOrderDetailsStatusDTO';

@Injectable()
export class OrderDetailsStatusService {
  constructor(
    @InjectRepository(OrderDetailsStatusEntity)
    private readonly OrderDetailsStatusRepository: Repository<OrderDetailsStatusEntity>,
  ) {}

  getAll() {
    return this.OrderDetailsStatusRepository.find();
  }

  getByName(nombre: string) {
    const item = this.OrderDetailsStatusRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.OrderDetailsStatusRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createOrderDetailsStatus(createDto: CreateOrderDetailsStatusDTO) {
    const newItem = new OrderDetailsStatusEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.OrderDetailsStatusRepository.save(newItem);
  }

  async deleteOrderDetailsStatus(id: number): Promise<void> {
    const item = await this.OrderDetailsStatusRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.OrderDetailsStatusRepository.delete(id);
  }
}
