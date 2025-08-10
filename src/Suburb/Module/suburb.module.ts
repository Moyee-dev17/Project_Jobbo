import { Module } from '@nestjs/common';
import { SuburbService } from '../service/suburb.service';
import { SuburbController } from '../Controllers/suburb.controller';

@Module({
  controllers: [SuburbController],
  providers: [SuburbService],
})
export class SuburbModule {}
