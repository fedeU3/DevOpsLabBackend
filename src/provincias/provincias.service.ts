import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvinciasEntity } from './provincias.entity';

@Injectable()
export class ProvinciasService {
  constructor(
    @InjectRepository(ProvinciasEntity)
    private readonly provinciasRepository: Repository<ProvinciasEntity>,
  ) {}

  getAll() {
    return this.provinciasRepository.find();
  }

  getByName(nombre: string) {
    return this.provinciasRepository.find({
      where: { provincia: ILike(`%${nombre}%`) },
    });
  }
}
