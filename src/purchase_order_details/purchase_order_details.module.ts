import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { {{EntityName}}Controller } from './{{entityName}}.controller';
import { {{EntityName}}Service } from './{{entityName}}.service';
import { {{EntityName}}Entity } from './{{entityName}}.entity';

@Module({
  imports: [TypeOrmModule.forFeature([{{EntityName}}Entity])],
  controllers: [{{EntityName}}Controller],
  providers: [{{EntityName}}Service],
})
export class {{EntityName}}Module {}
