const express = require('express');

module.exports = (db) => {
  const app = express();

  app.get('/', (req, res) => {
    let { page = 1, count = 5 , sort = 'newest' , product_id } = req.query;

    db.getReviews(req, res);
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

  return app;
}

