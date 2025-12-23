import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippersController } from './shippers.controller';
import { ShippersService } from './shippers.service';
import { ShippersEntity } from './shippers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShippersEntity])],
  controllers: [ShippersController],
  providers: [ShippersService],
})
export class ShippersModule {}
