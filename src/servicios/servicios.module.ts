import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiciosController } from './servicios.controller';
import { ServiciosService } from './servicios.service';
import { ServiciosEntity } from './servicios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiciosEntity])],
  controllers: [ServiciosController],
  providers: [ServiciosService],
  exports: [ServiciosService],
})
export class ServiciosModule { }
