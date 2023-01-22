export class UserUnauthorizedException extends Error {
  constructor() {
    const message = 'Unauthorized';
    super(message);
    this.name = 'UserUnauthorizedException';
  }
}
