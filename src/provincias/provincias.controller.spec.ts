import { Test, TestingModule } from '@nestjs/testing';
import { ProvinciasController } from './provincias.controller';
import { ProvinciasService } from './provincias.service';

describe('ProvinciasController', () => {
  let provinciasController: ProvinciasController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProvinciasController],
      providers: [ProvinciasService],
    }).compile();

    provinciasController = app.get<ProvinciasController>(ProvinciasController);
  });

  it('should be defined', () => {
    expect(provinciasController).toBeDefined();
  });
});
