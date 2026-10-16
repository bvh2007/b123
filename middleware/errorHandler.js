const AppError = require('../utils/AppError');

/** Xử lý lỗi tập trung cho toàn bộ ứng dụng. */
class ErrorHandler {
  static notFound(req, res, next) {
    next(new AppError('Không tìm thấy đường dẫn ' + req.originalUrl, 404));
  }

  static handle(err, req, res, next) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File quá lớn (tối đa 20MB)' });
    if (err instanceof AppError) return res.status(err.status).json({ message: err.message });

    console.error(err);
    res.status(500).json({ message: 'Lỗi máy chủ, vui lòng thử lại' });
  }
}

module.exports = ErrorHandler;
