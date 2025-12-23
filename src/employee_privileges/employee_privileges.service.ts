import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeePrivilegesEntity } from './employee_privileges.entity';
import { CreateEmployeePrivilegesDTO } from './DTO/CreateEmployeePrivilegesDTO';
@Injectable()
export class EmployeePrivilegesService {
  constructor(
    @InjectRepository(EmployeePrivilegesEntity)
    private readonly EmployeePrivilegesRepository: Repository<EmployeePrivilegesEntity>,
  ) {}

  getAll() {
    return this.EmployeePrivilegesRepository.find();
  }

  getByName(nombre: string) {
    const item = this.EmployeePrivilegesRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });

    if (!nombre) {
      throw new NotFoundException(`Elemento con nombre ${nombre} no encontrado`);
    }

    return item;
  }

  getByType(tipo: string) {
    const item = this.EmployeePrivilegesRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    });

    if (!item) {
      throw new NotFoundException(`Elemento con tipo ${tipo} no encontrado`);
    }

    return item;
  }

  async createEmployeePrivileges(createDto: CreateEmployeePrivilegesDTO) {
    const newItem = new EmployeePrivilegesEntity();
    // 🧩 Aquí mapea los campos manualmente según tu DTO
    // newItem.nombre = createDto.nombre;
    // newItem.tipo = createDto.tipo;

    return this.EmployeePrivilegesRepository.save(newItem);
  }

  async deleteEmployeePrivileges(id: number): Promise<void> {
    const item = await this.EmployeePrivilegesRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Elemento con id ${id} no encontrado`);
    }
    await this.EmployeePrivilegesRepository.delete(id);
  }
}