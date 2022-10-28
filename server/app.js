const express = require('express');

module.exports = (db) => {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('No Route');
  })

  app.get('/reviews', (req, res) => {
    let { page = 1, count = 5, sort, product_id } = req.query;

    let data = {
      product: product_id,
      page: page * count - count,
      count
    }

    db.getReviews(req.query)
      .then(result => {
        data.result = result.rows;
        res.status(200).json(data);
      })
      .catch(error => {
        console.log(error.stack);
        res.status(404).send(error.stack);
      })
  })

  app.get('/reviews/meta', (req, res) => {
    let { product_id } = req.query;

    let data = {
      product_id,
      ratings: {},
      recommended: {},
      characteristics: {}
    }

    db.getMetaData(req.query, data)
      .then(() => {
        res.status(200).json(data);
      })
      .catch(error => {
        console.log(error.stack);
        res.status(404).send(error.stack);
      })
  })

  app.post('/reviews', (req, res) => {
    db.postReview(req)
      .then(result => {
        res.status(200).send(`Successfully posted review for product ${req.body.product_id}`);
      })
      .catch(error => {
        res.status(400).send(error.stack);
      })
  })

  app.put('/reviews/:review_id/helpful', (req, res) => {
    db.markHelpful(req.params)
      .then(result => {
        res.status(200).send(`Marked review ${req.params.review_id} as helpful`);
      })
      .catch(error => {
        res.status(400).send(error.stack);
      })
  })

  app.put('/reviews/:review_id/report', (req, res) => {
    db.reportReview(req.params)
      .then(result => {
        res.status(200).send(`Reported review ${req.params.review_id}`);
      })
      .catch(error => {
        res.status(400).send(error.stack);
      })
  })

  return app;
}

