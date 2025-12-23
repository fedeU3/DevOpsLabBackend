import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeesEntity } from './employees.entity';
import { CreateEmployeesDTO } from './DTO/CreateEmployeesDTO';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeesEntity)
    private readonly EmployeesRepository: Repository<EmployeesEntity>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

    getAll() {
    return this.EmployeesRepository.find();
  }

  
  getByName(nombre: string) {
    const equipo = this.EmployeesRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    })

    if (!nombre) {
      throw new NotFoundException(`Equipo con ID ${nombre} no encontrado`);
    }

    return equipo;
  }

  getByType(tipo: string) {
    const equipo = this.EmployeesRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    })

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${tipo} no encontrado`);
    }

    return equipo;
  }

  async createCustomers(createEmployeesDto: CreateEmployeesDTO) {
    const Employees = new EmployeesEntity();

    //customers.nombre = createCustomersDtonombre;
    //Employees.tipo = createEmployeesDto.tipo;
    //Employees.pertenencia = createEmployeessDto.pertenencia;

    return this.EmployeesRepository.save(Employees);
  }

  async deleteEmployees(id: number): Promise<void> {
    const customers = await this.EmployeesRepository.findOneBy({ id });
    if (!customers) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }
    await this.EmployeesRepository.delete(id);
  }
}