import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { UserAlreadyExistsException, UserNotFoundException } from './errors';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

    return this.signToken(userFound.id, userFound.email);
  }

  private async signToken(
    userId: number,
    email: string,
  ): Promise<{ token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const expiresIn = this.config.get('JWT_EXPIRES_IN');
    const jwtToken = await this.jwt.signAsync(payload, {
      expiresIn,
      secret,
    });
    return {
      token: jwtToken,
    };
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
