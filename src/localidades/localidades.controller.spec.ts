import { Test, TestingModule } from '@nestjs/testing';
import { LocalidadesController } from './localidades.controller';
import { LocalidadesService } from './localidades.service';

describe('LocalidadesController', () => {
  let localidadesController: LocalidadesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LocalidadesController],
      providers: [LocalidadesService],
    }).compile();

    localidadesController = app.get<LocalidadesController>(LocalidadesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      /* expect(localidadesController.getHello()).toBe('Hello World!'); */
    });
  });
});
