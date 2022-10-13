const express = require('express');

module.exports = (db) => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('No Route');
  })

  app.get('/reviews', (req, res) => {
    db.getReviews(req, res);
  })

  app.get('/reviews/meta', (req, res) => {
    db.getMetaData(req, res);
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

