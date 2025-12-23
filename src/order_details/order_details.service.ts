import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailsEntity } from './order_details.entity';
import { CreateOrderDetailsDTO } from './DTO/CreateOrderDetailsDTO';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetailsEntity)
    private readonly OrderDetailsRepository: Repository<OrderDetailsEntity>,
  ) {}

  getAll() {
    return this.OrderDetailsRepository.find();
  }

  getByName(nombre: string) {
    const item = this.OrderDetailsRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.OrderDetailsRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createOrderDetails(createDto: CreateOrderDetailsDTO) {
    const newItem = new OrderDetailsEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.OrderDetailsRepository.save(newItem);
  }

  async deleteOrderDetails(id: number): Promise<void> {
    const item = await this.OrderDetailsRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.OrderDetailsRepository.delete(id);
  }
}
