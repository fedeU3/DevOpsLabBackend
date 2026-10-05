import { ConflictException, Injectable, NotFoundException, Request, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private jwtService: JwtService
  ) { }
  getAuth(user) {
    const { password, _id, ...result } = user;
    return result;
  }

  // Endpoint de login que recibe un objeto LoginDTO y devuelve un token JWT si las credenciales son válidas
  async login(loginDTO: LoginDTO): Promise<{ token: string }> {
    const { usuario, password } = loginDTO;

    // Controla que el usuario exista en la base de datos
    const existingUser = await this.usuariosService.getByUserName(usuario);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Un usuario dado de baja no puede iniciar sesion
    if (existingUser.estado !== 'A') {
      throw new UnauthorizedException('User is inactive');
    }

    // Controla que la contraseña sea correcta
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Genera un token JWT para el usuario autenticado
    const token = this.jwtService.sign({
      id: existingUser.idUsuario,
    })

    // Actualiza el token en la base de datos
    await this.usuariosService.updateToken(existingUser.idUsuario, token);

    // Devuelve el token al cliente
    return { token };
  }

  /*   async signUp(signUpDTO: SignUpDTO): Promise<{token: string}> {
      const { password } = signUpDTO;
  
      const existingUser = await this.usuariosService.getByUserName(signUpDTO.usuario);
  
      if (existingUser) {
        throw new ConflictException('User with this user name already exists');
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await this.usuariosService.createUsuario({
        ...signUpDTO,
        password: hashedPassword,
      })
  
      const token = this.jwtService.sign({ id: newUser.idUsuario });
  
      return { token };
    } */
}