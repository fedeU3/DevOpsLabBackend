import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesReportsEntity } from './sales_reports.entity';
import { CreateSalesReportsDTO } from './DTO/CreateSalesReportsDTO';

@Injectable()
export class SalesReportsService {
  constructor(
    @InjectRepository(SalesReportsEntity)
    private readonly SalesReportsRepository: Repository<SalesReportsEntity>,
  ) {}

  getAll() {
    return this.SalesReportsRepository.find();
  }

  getByName(nombre: string) {
    const item = this.SalesReportsRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.SalesReportsRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createSalesReports(createDto: CreateSalesReportsDTO) {
    const newItem = new SalesReportsEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.SalesReportsRepository.save(newItem);
  }

  async deleteSalesReports(id: number): Promise<void> {
    const item = await this.SalesReportsRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.SalesReportsRepository.delete(id);
  }
}
