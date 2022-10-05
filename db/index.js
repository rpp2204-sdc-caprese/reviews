const { Pool, Client } = require('pg');
const Promise = require('bluebird');
require('dotenv').config();

const pool = new Pool({
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = Promise.promisifyAll(pool);