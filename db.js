const mysql = require('mysql2/promise');

class Database {
  constructor(config) {
    this.config = config;
    this.pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      charset: 'utf8mb4',
      namedPlaceholders: true,
    });
  }
  async connect() {
    const conn = await this.pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ Đã kết nối MySQL');
  }
  async close() { await this.pool.end(); }
}
module.exports = Database;
