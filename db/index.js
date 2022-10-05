const { Pool, Client } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD
});

pool.query('SELECT * FROM characteristics WHERE id = 1', (err, res) => {
  console.log('response', res);
  pool.end();
})