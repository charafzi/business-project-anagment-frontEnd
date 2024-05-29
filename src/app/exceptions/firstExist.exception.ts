export class FirstExistException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FirstExistException";

    Object.setPrototypeOf(this, FirstExistException.prototype);
  }
}
