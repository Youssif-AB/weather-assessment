const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./weather.db");

db.run(`
    CREATE TABLE IF NOT EXISTS searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL,
    temperature REAL,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    `);

module.exports = db;