import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersEntity } from './customers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomersEntity])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
