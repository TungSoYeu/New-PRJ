const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'store',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

db.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
  release();
});

module.exports = db;
