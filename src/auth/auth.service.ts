import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {
    return { msg: 'hello' };
  }

  async signup(userDto: AuthDto) {
    const userFound = await this.prisma.user.findFirst({
      where: {
        email: userDto.email,
      },
    });

    if (userFound) {
      return new Error('user already exists with email');
    }

    const hash = await argon.hash(userDto.password);
    const user = await this.prisma.user.create({
      data: {
        email: userDto.email,
        passwordHash: hash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }
}
