const bcrypt = require('bcryptjs');

/** Mã hoá và so sánh mật khẩu. */
class PasswordService {
  constructor(rounds = 10) {
    this.rounds = rounds;
  }

  hash(plain) {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}

module.exports = PasswordService;
