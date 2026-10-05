import { Controller, Get } from '@nestjs/common';

@Controller()
export class HomeController {
  // Método para verificar que la API está funcionando correctamente
  @Get('home')
  home() {
    return {
      ok: true,
      message: 'API funcionando ✅',
      timestamp: new Date().toISOString(),
    };
  }

  getHello(): string {
    return 'Hello World!';
  }
}
