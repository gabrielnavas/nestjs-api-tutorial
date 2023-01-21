import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { UserAlreadyExistsException, UserNotFoundException } from './errors';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signin(authDto: AuthDto) {
    const userFound = await this.prisma.user.findFirst({
      where: {
        email: authDto.email,
      },
    });
    if (!userFound) {
      throw new UserNotFoundException();
    }

    const passwordsMatches = await argon.verify(
      userFound.passwordHash,
      authDto.password,
    );
    if (!passwordsMatches) {
      throw new UserNotFoundException();
    }

    // send back the user
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
