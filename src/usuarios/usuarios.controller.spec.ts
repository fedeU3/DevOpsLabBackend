import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { UsuariosEntity } from './usuarios.entity';

describe('UsuariosController', () => {
  let usuariosController: UsuariosController;
  const usuariosRepository = { find: jest.fn() };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        UsuariosService,
        { provide: getRepositoryToken(UsuariosEntity), useValue: usuariosRepository },
      ],
    }).compile();

    usuariosController = app.get<UsuariosController>(UsuariosController);
  });

  describe('getAll', () => {
    it('should return all usuarios', async () => {
      const usuarios = [{ id: 1 }, { id: 2 }];
      usuariosRepository.find.mockResolvedValue(usuarios);

      await expect(usuariosController.getAll()).resolves.toBe(usuarios);
      expect(usuariosRepository.find).toHaveBeenCalled();
    });
  });
});
