/** Lỗi nghiệp vụ có kèm mã HTTP (400, 401, 403, 404, 409...). */
class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

module.exports = AppError;
