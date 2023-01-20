export class UserAlreadyExistsException extends Error {
  constructor(attribute: string) {
    const message = `user already exists with ${attribute}`;
    super(message);
    this.name = 'UserAlreadyExistsException';
  }
}
