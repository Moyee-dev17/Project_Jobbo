import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './Prisma-config/prisma.module';
import { SeederService } from './Seeder/seed';
import { CategoriesModule } from './Categories/category.module';
import { UsersController } from './Users/controllers/users.controller';
import { UsersModule } from './Users/module/usersLogin.module';
import { UsersService } from './Users/service/users.register.service';
import { UsersLoginController } from './Users/controllers/usersLogin.controller';
import { loginUser } from './Users/service/users.login.service';
import { jwtService } from './Authentification/JwtService';
import { ConfigModule } from '@nestjs/config';
import { authModule } from './Authentification/auth.module';
import { CityController } from './City/controllers/city.controller';
import { cityService } from './City/city.service';
import { MunicipalityController } from './Municipality/controllers/municipality.controller';
import { municipalityService } from './Municipality/municipality.service';
import { SuburbController } from './Suburb/Controllers/suburb.controller';
import { SuburbService } from './Suburb/suburb.service';
import { PostController } from './Post/controllers/post.controller';
import { PostService } from './Post/post.service';

import { loginAdmin } from './Users/service/admin.login.service';
import { AdminController } from './Users/controllers/admin.controllers';
import { OtpController } from './authorization-manager/Otp.controller';
import { OtpModule } from './authorization-manager/Otp.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    UsersModule,
    authModule,
    ConfigModule.forRoot({ isGlobal: true }),
    OtpModule,
  ],
  controllers: [
    AppController,
    UsersController,
    UsersLoginController,
    CityController,
    MunicipalityController,
    SuburbController,
    PostController,
    AdminController,
    OtpController,
  ],
  providers: [
    AppService,
    SeederService,
    UsersService,
    loginUser,
    jwtService,
    cityService,
    municipalityService,
    SuburbService,
    PostService,
    loginAdmin,
  ],
})
export class AppModule {}
