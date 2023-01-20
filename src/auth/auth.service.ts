import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  login() {
    return { msg: 'hello' };
  }

  signup() {
    return { msg: 'hello' };
  }
}
