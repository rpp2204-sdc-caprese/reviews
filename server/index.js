const express = require('express');
const app = express();
const port = 3000;
const db = require('../db/index.js');

app.get('/', (req, res) => {
  db.query('SELECT * FROM characteristics WHERE id = 1', (err, result) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(result.rows);
      res.json(result.rows);
    }
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})

