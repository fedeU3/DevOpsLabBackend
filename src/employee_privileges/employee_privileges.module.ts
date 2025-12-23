import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeePrivilegesController } from './employee_privileges.controller';
import { EmployeePrivilegesService } from './employee_privileges.service';
import { EmployeePrivilegesEntity } from './employee_privileges.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeePrivilegesEntity])],
  controllers: [EmployeePrivilegesController],
  providers: [EmployeePrivilegesService],
})
export class EmployeePrivilegesModule {}