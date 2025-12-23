import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailsStatusController } from './order_details_status.controller';
import { OrderDetailsStatusService } from './order_details_status.service';
import { OrderDetailsStatusEntity } from './order_details_status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetailsStatusEntity])],
  controllers: [OrderDetailsStatusController],
  providers: [OrderDetailsStatusService],
})
export class OrderDetailsStatusModule {}
