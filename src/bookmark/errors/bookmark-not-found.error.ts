export class BookmarkNotFoundException extends Error {
  constructor() {
    const message = 'book mark not found';
    super(message);
    this.name = 'BookmarkNotFoundException';
  }
}
