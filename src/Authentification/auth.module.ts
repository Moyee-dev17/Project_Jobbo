import { PrismaModule } from 'src/Prisma-config/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
@Module({
  providers: [AuthService],
  imports: [
    PrismaModule,
    JwtModule.register({ global: true, secret: process.env.SECRET_KEY }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  exports: [AuthService],
})
export class authModule {}
