import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './Prisma-config/prisma.service';
import { PrismaModule } from './Prisma-config/prisma.module';
import { SeederService } from './Seeder/seed';
import { CreateUserDto } from './Users/userRegister/dto/create-user.dto';
import { CategoriesModule } from './Categories/modules/categories.module';
import { UsersController } from './Users/userRegister/controllers/users.controller';
import { UsersModule } from './Users/UserLogin/module/users.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './Users/userRegister/service/users.register.service';
import { UsersLoginController } from './Users/UserLogin/controllers/users.controller';
import { loginUser } from './Users/UserLogin/service/users.login.service';
import { AuthService } from './Authentification/auth.service';
import { ConfigModule } from '@nestjs/config';
import { authModule } from './Authentification/auth.module';
import { CityController } from './City/controllers/city.controller';
import { CityService } from './City/service/city.service';
import { MunicipalityController } from './Municipality/controllers/municipality.controller';
import { MunicipalityService } from './Municipality/service/municipality.service';
import { SuburbController } from './Suburb/Controllers/suburb.controller';
import { SuburbService } from './Suburb/service/suburb.service';
import { PostController } from './Post/controllers/post.controller';
import { PostService } from './Post/service/post.service';
import { AdminLoginController } from './Users/UserLogin/controllers/admin.controller';
import { loginAdmin } from './Users/UserLogin/service/admin.login.service';
import { AdminController } from './Users/userRegister/controllers/admin.controllers';
import { otpService } from './Authentification/otpAuth.service';
import { OtpController } from './Authentification/otpAuth.controller';
import { OtpVerifyService } from './Authentification/otpVerify';
import { OtpModule } from './Authentification/otp.module';

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
    AdminLoginController,
    AdminController,
    OtpController,
  ],
  providers: [
    AppService,
    SeederService,
    UsersService,
    loginUser,
    AuthService,
    CityService,
    MunicipalityService,
    SuburbService,
    PostService,
    loginAdmin,
  ],
})
export class AppModule {}
