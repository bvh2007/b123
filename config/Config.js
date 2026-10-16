const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
class Config {
  static get port() { return Number(process.env.PORT || 3000); }
  static get jwtSecret() { return process.env.JWT_SECRET || 'dev_secret_change_me'; }
  static get db() { return { host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'tailieu_sv' }; }
  static get uploadDir() { return path.join(__dirname, '..', 'uploads'); }
  static get frontendDir() { return path.join(__dirname, '..', '..', 'frontend'); }
  static get maxFileSize() { return 20 * 1024 * 1024; }
  static get allowedExtensions() { return ['.pdf', '.doc', '.docx']; }
}
module.exports = Config;
