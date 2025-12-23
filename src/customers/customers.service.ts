import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersEntity } from 'src/customers/customers.entity';
import { CreateCustomersDTO } from 'src/customers/DTO/CreateCustomersDTO';

@Injectable()
export class CustomersService {

  constructor(
    @InjectRepository(CustomersEntity)
    private readonly CustomersRepository: Repository<CustomersEntity>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

    getAll() {
    return this.CustomersRepository.find();
  }

  
  getByName(nombre: string) {
    const equipo = this.CustomersRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    })

    if (!nombre) {
      throw new NotFoundException(`Equipo con ID ${nombre} no encontrado`);
    }

    return equipo;
  }

  getByType(tipo: string) {
    const equipo = this.CustomersRepository.find({
      where: { tipo: ILike(`%${tipo}%`) },
    })

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${tipo} no encontrado`);
    }

    return equipo;
  }

  async createCustomers(createCustomersDto: CreateCustomersDTO) {
    const customers = new CustomersEntity();

    //customers.nombre = createCustomersDtonombre;
    customers.tipo = createCustomersDto.tipo;
    customers.pertenencia = createCustomersDto.pertenencia;

    return this.CustomersRepository.save(customers);
  }

  async deleteCustomers(id: number): Promise<void> {
    const customers = await this.CustomersRepository.findOneBy({ id });
    if (!customers) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }
    await this.CustomersRepository.delete(id);
  }
}
