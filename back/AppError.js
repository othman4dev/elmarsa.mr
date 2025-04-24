class AppError extends Error {
  constructor(errCode, message, statusCode, detail = null) {
    super(message);
    this.errCode = errCode;
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

export default AppError;
