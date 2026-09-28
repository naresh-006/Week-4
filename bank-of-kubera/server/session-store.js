const session = require("express-session");

class SQLiteSessionStore extends session.Store {
  constructor(database, maxAge) {
    super();
    this.maxAge = maxAge;
    this.getSession = database.prepare("SELECT data, expires_at FROM sessions WHERE sid = ?");
    this.saveSession = database.prepare(`
      INSERT INTO sessions (sid, data, expires_at) VALUES (?, ?, ?)
      ON CONFLICT(sid) DO UPDATE SET data = excluded.data, expires_at = excluded.expires_at
    `);
    this.deleteSession = database.prepare("DELETE FROM sessions WHERE sid = ?");
    this.updateExpiry = database.prepare("UPDATE sessions SET expires_at = ? WHERE sid = ?");
    this.deleteExpired = database.prepare("DELETE FROM sessions WHERE expires_at <= ?");
  }

  get(sessionId, callback) {
    try {
      const row = this.getSession.get(sessionId);
      if (!row) return callback(null, null);
      if (row.expires_at <= Date.now()) {
        this.deleteSession.run(sessionId);
        return callback(null, null);
      }
      return callback(null, JSON.parse(row.data));
    } catch (error) {
      return callback(error);
    }
  }

  set(sessionId, value, callback = () => {}) {
    try {
      const expiresAt = value.cookie?.expires
        ? new Date(value.cookie.expires).getTime()
        : Date.now() + this.maxAge;
      this.saveSession.run(sessionId, JSON.stringify(value), expiresAt);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  touch(sessionId, value, callback = () => {}) {
    try {
      const expiresAt = value.cookie?.expires
        ? new Date(value.cookie.expires).getTime()
        : Date.now() + this.maxAge;
      this.updateExpiry.run(expiresAt, sessionId);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  destroy(sessionId, callback = () => {}) {
    try {
      this.deleteSession.run(sessionId);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  clearExpired() {
    this.deleteExpired.run(Date.now());
  }
}

module.exports = SQLiteSessionStore;