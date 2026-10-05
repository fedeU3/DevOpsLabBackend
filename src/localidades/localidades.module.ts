import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalidadesController } from './localidades.controller';
import { LocalidadesService } from './localidades.service';
import { LocalidadesEntity } from './localidades.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocalidadesEntity])],
  controllers: [LocalidadesController],
  providers: [LocalidadesService],
})
export class LocalidadesModule { }
