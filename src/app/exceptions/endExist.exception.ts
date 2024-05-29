export class EndExistException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EndExistException";

    Object.setPrototypeOf(this, EndExistException.prototype);
  }
}
