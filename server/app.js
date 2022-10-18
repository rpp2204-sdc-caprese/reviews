const express = require('express');

module.exports = (db) => {
  const app = express();
  app.use(express.json());

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
    db.postReview(req, res);
  })

  app.put('/reviews/:review_id/helpful', (req, res) => {
    db.markHelpful(req, res);
  })

  app.put('/reviews/:review_id/report', (req, res) => {
    db.reportReview(req, res);
  })

  return app;
}

