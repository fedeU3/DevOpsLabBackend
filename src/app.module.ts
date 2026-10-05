import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProvinciasModule } from './provincias/provincias.module';
import { LocalidadesModule } from './localidades/localidades.module';
import { ServiciosModule } from './servicios/servicios.module';
import { TurnosModule } from './turnos/turnos.module';
import { HomeController } from './home/home.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // El pooler de Supabase en modo sesion (puerto 5432) admite 15 clientes en
      // total, compartidos con cualquier cliente SQL abierto (DBeaver, psql).
      // Sin este limite, pg abre hasta 10 por su cuenta y se agota el pool.
      extra: {
        max: 5,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 10000,
      },
      // Imprime por consola cada consulta SQL que emite TypeORM, con sus parametros
      //logging: ['query', 'error'],
      // Registra automaticamente las entidades de cada TypeOrmModule.forFeature
      autoLoadEntities: true,
      schema: 'public',
    }),
    UsuariosModule,
    LocalidadesModule,
    ProvinciasModule,
    ServiciosModule,
    TurnosModule,
    AuthModule,
  ],
  controllers: [HomeController],
  providers: [],
})
export class AppModule {}
