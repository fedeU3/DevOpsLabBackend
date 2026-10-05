import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import type { StringValue } from 'ms';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET!, // 👈 asegura no-undefined
        signOptions: {
          expiresIn: (process.env.JWT_EXPIRE as StringValue) ?? '1h', // 👈 tipado + fallback
        },
      }),
    }),
    UsuariosModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
