export default class AppError extends Error {
  status: string;
  isOperational: boolean;

  constructor(public msg: string, public statusCode: number = 500) {
    super(msg);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
