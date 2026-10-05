import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiciosEntity } from './servicios.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(ServiciosEntity)
    private readonly serviciosRepository: Repository<ServiciosEntity>,
  ) { }

  // Devuelve todos los servicios ordenados por nombre
  getAll() {
    return this.serviciosRepository.find({
      order: { servicio: 'ASC' },
    });
  }

  // Devuelve el servicio con el ID especificado, o null si no existe
  getById(id: number) {
    return this.serviciosRepository.findOne({
      where: { idServicio: id },
    });
  }

  // Busca el servicio. Lanza NotFoundException si no existe.
  // Lo reutilizan el GET /:id, el PUT, el PATCH, el DELETE y el modulo de turnos.
  async buscarServicio(id: number): Promise<ServiciosEntity> {
    const servicio = await this.getById(id);
    if (!servicio) throw new NotFoundException(`El Servicio ${id} no fue encontrado`);
    return servicio;
  }

  // Dado un texto devuelve los servicios activos cuyo nombre lo contiene, del mas barato al mas caro
  getByNombre(nombre: string) {
    return this.serviciosRepository.find({
      where: { estado: 'A', servicio: ILike(`%${nombre}%`) },
      select: ['idServicio', 'servicio', 'duracion', 'precio'],
      order: { precio: 'ASC' },
    });
  }

  async createServicio(dto: CreateServicioDto): Promise<ServiciosEntity> {
    const servicio = new ServiciosEntity();

    servicio.servicio = dto.servicio;
    servicio.duracion = dto.duracion;
    servicio.precio = dto.precio;
    servicio.estado = dto.estado ?? 'A';

    return this.serviciosRepository.save(servicio);
  }

  // PUT: reemplaza todos los campos del servicio
  async replaceServicio(id: number, dto: CreateServicioDto): Promise<ServiciosEntity> {
    const servicio = await this.buscarServicio(id);

    servicio.servicio = dto.servicio;
    servicio.duracion = dto.duracion;
    servicio.precio = dto.precio;
    servicio.estado = dto.estado ?? 'A';

    return this.serviciosRepository.save(servicio);
  }

  // PATCH: modifica solo los campos enviados
  async updateServicio(id: number, dto: UpdateServicioDto): Promise<ServiciosEntity> {
    const servicio = await this.buscarServicio(id);
    Object.assign(servicio, dto);
    return this.serviciosRepository.save(servicio);
  }

  // Baja logica: el servicio puede tener turnos asociados, por eso no se borra de la tabla
  async deleteServicio(id: number): Promise<void> {
    await this.buscarServicio(id);
    await this.serviciosRepository.update({ idServicio: id }, { estado: 'B' });
  }
}
