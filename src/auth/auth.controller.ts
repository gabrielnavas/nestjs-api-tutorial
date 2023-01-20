import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
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
    }
  }

  @Post('signin')
  signin() {
    return this.authService.login();
  }
}
