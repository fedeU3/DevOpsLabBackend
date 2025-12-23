import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringsController } from './strings.controller';
import { StringsService } from './strings.service';
import { StringsEntity } from './strings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StringsEntity])],
  controllers: [StringsController],
  providers: [StringsService],
})
export class StringsModule {}
