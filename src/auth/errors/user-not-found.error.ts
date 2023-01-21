export class UserNotFoundException extends Error {
  constructor() {
    const message = 'user not found';
    super(message);
    this.name = 'UserNotFoundException';
  }
}
