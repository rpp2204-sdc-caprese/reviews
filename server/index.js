const express = require('express');
const app = express();
const port = 3000;
const db = require('../db/index.js');

app.get('/', (req, res) => {
  db.queryAsync('SELECT * FROM reviews LIMIT 5')
    .then(response => {
      res.json(response.rows);
    })
    .catch(error => {
      console.log(error.stack)
    })
})

app.get('/reviews', (req, res) => {
  res.send('Send back reviews')
})

app.get('/reviews/meta', (req, res) => {
  res.send('Send back meta data')
})

app.post('/reviews', (req, res) => {
  res.send('post review')
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  res.send('mark as helpful')
})

app.put('/reviews/:review_id/report', (req, res) => {
  res.send('mark as reported')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})

