import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtservice: JwtService) {}
  async tokenGenerate(payload: { id: number }) {
    const secretkey = process.env.SECRET_KEY as string;
    const token = this.jwtservice.sign(payload, {
      secret: secretkey,
    });
    return token;
  }
}
