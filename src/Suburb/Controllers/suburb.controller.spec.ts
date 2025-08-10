import { Test, TestingModule } from '@nestjs/testing';
import { SuburbController } from './suburb.controller';
import { SuburbService } from '../service/suburb.service';

describe('SuburbController', () => {
  let controller: SuburbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuburbController],
      providers: [SuburbService],
    }).compile();

    controller = module.get<SuburbController>(SuburbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
