import { Module } from '@nestjs/common';
import { SuburbService } from './suburb.service';
import { SuburbController } from './Controllers/suburb.controller';

@Module({
  controllers: [SuburbController],
  providers: [SuburbService],
})
export class SuburbModule {}
