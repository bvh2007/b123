const jwt = require('jsonwebtoken');

/** Tạo và kiểm tra token đăng nhập (JWT). */
class TokenService {
  constructor(secret, expiresIn = '7d') {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = TokenService;
