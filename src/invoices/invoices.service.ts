import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoicesEntity } from './invoices.entity';
import { CreateInvoicesDTO } from './DTO/CreateInvoicesDTO';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoicesEntity)
    private readonly InvoicesRepository: Repository<InvoicesEntity>,
  ) {}

  getAll() {
    return this.InvoicesRepository.find();
  }

  getByName(nombre: string) {
    const item = this.InvoicesRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.InvoicesRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createInvoices(createDto: CreateInvoicesDTO) {
    const newItem = new InvoicesEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.InvoicesRepository.save(newItem);
  }

  async deleteInvoices(id: number): Promise<void> {
    const item = await this.InvoicesRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.InvoicesRepository.delete(id);
  }
}
