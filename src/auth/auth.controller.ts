import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { UserAlreadyExistsException, UserNotFoundException } from './errors';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    try {
      return await this.authService.signup(dto);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }

  @Post('signin')
  async signin(@Body() dto: AuthDto) {
    try {
      const result = await this.authService.signin(dto);
      return { access_token: result.token };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new ForbiddenException(error.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }
}
