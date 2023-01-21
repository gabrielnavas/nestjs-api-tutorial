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
import { UserAlreadyExistsException } from './errors';

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
  signin(@Body() dto: AuthDto) {
    try {
      return this.authService.signin(dto);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new ForbiddenException(error.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }
}
