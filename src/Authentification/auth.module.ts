import { PrismaModule } from 'src/Prisma-config/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { jwtService } from './JwtService';
@Module({
  providers: [jwtService],
  imports: [
    PrismaModule,
    JwtModule.register({ global: true, secret: process.env.SECRET_KEY }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '24h' }
      }),
    }),
  ],
  exports: [jwtService],
})
export class authModule {}
