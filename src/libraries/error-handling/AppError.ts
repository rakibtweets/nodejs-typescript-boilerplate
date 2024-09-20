class AppError extends Error {
  public HTTPStatus: number;
  public isTrusted: boolean;
  public cause: Error | null;

  constructor(
    name: string,
    message: string,
    HTTPStatus: number = 500,
    isTrusted: boolean = true,
    cause: Error | null = null
  ) {
    super(message);
    this.name = name;
    this.HTTPStatus = HTTPStatus;
    this.isTrusted = isTrusted;
    this.cause = cause;

    // Setting the prototype explicitly to fix issues with instanceof
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export { AppError };
