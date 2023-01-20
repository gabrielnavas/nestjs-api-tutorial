import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { UserAlreadyExistsException } from './errors';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {
    return { msg: 'hello' };
  }

  async signup(userDto: AuthDto) {
    const userFoundWithEmail = await this.prisma.user.findFirst({
      where: {
        email: userDto.email,
      },
    });

    if (userFoundWithEmail) {
      throw new UserAlreadyExistsException('email');
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
