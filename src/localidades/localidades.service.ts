import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalidadesEntity } from './localidades.entity';

@Injectable()
export class LocalidadesService {
  constructor(
    @InjectRepository(LocalidadesEntity)
    private readonly localidadesRepository: Repository<LocalidadesEntity>,
  ) {}

  getAll() {
    return this.localidadesRepository.find();
  }

  getByName(nombre: string) {
    return this.localidadesRepository.find({
      where: { localidad: ILike(`%${nombre}%`) },
    });
  }
}
