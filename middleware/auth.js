const AppError = require('../utils/AppError');

/** Middleware kiểm tra token đăng nhập (Authorization: Bearer <token>). */
class AuthMiddleware {
  constructor(tokenService) {
    this.tokenService = tokenService;
  }

  authenticate = (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next(new AppError('Bạn cần đăng nhập để thực hiện chức năng này', 401));

    try {
      const data = this.tokenService.verify(token);
      req.user = { id: data.id, name: data.name };
      next();
    } catch (err) {
      next(new AppError('Phiên đăng nhập không hợp lệ hoặc đã hết hạn', 401));
    }
  };
}

module.exports = AuthMiddleware;
