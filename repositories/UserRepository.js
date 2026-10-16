class UserRepository {
  constructor(db) { this.db = db; }
  async findByEmail(email) { const [r]=await this.db.pool.query('SELECT u.*, r.role_name FROM users u JOIN roles r ON r.role_id=u.role_id WHERE u.email=? AND u.deleted_at IS NULL LIMIT 1',[String(email||'').trim().toLowerCase()]); return r[0]||null; }
  async create({name,email,password}) { const username=email.split('@')[0].slice(0,50); const [r]=await this.db.pool.query('INSERT INTO users(role_id,username,email,password_hash,full_name) VALUES(1,?,?,?,?)',[username,email.toLowerCase(),password,name]); return this.findById(r.insertId); }
  async findById(id) { const [r]=await this.db.pool.query('SELECT u.*, r.role_name FROM users u JOIN roles r ON r.role_id=u.role_id WHERE u.user_id=? AND u.deleted_at IS NULL',[id]); return r[0]||null; }
  async updateLastLogin(id) { await this.db.pool.query('UPDATE users SET last_login_at=NOW() WHERE user_id=?',[id]); }
}
module.exports = UserRepository;
