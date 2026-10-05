import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinciasController } from './provincias.controller';
import { ProvinciasService } from './provincias.service';
import { ProvinciasEntity } from './provincias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProvinciasEntity])],
  controllers: [ProvinciasController],
  providers: [ProvinciasService],
})
export class ProvinciasModule {}
