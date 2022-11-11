const express = require('express');
const Redis = require('redis');
require('dotenv').config();

const redisClient = Redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

redisClient.connect()
  .then(() => {
    console.log('Redis Connected Successfully')
  })
  .catch(error => {
    console.error(error.stack)
  })

const EXPIRATION = 3600;


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

    redisClient.get(`reviews?product_id=${product_id}`)
      .then(async (reviews) => {
        if (reviews !== null) {
          res.status(200).json(JSON.parse(reviews))
        } else {
          const reviewData = await db.getReviews(req.query);
          data.result = reviewData.rows;
          redisClient.SETEX(`reviews?product_id=${product_id}`, EXPIRATION, JSON.stringify(data))
          res.status(200).json(data);
        }
      })
      .catch(err => {
        console.error(err.stack);
        res.status(404).send(err.stack);
      })

    // redisClient.get(`reviews?product_id=${product_id}`, (err, reviews) => {
    //   if (err) console.error(err);
    //   if (reviews !== null) {
    //     console.log('inside if')
    //     return res.status(200).json(JSON.parse(reviews))
    //   } else {
    //     console.log('inside else')
    //     db.getReviews(req.query)
    //     .then(result => {
    //       data.result = result.rows;
    //       redisClient.setex(`reviews?product_id=${product_id}`, EXPIRATION, JSON.stringify(data))
    //       res.status(200).json(data);
    //     })
    //     .catch(error => {
    //       console.log(error.stack);
    //       res.status(404).send(error.stack);
    //     })
    //   }
    // })
  })

  app.get('/reviews/meta', (req, res) => {
    let { product_id } = req.query;

    let data = {
      product_id,
      ratings: {},
      recommended: {},
      characteristics: {}
    }

    redisClient.get(`metas?product_id=${product_id}`)
      .then(async (metas) => {
        if (metas !== null) {
          return res.status(200).json(JSON.parse(metas))
        } else {
          const metaData = await db.getMetaData(req.query, data);
          redisClient.SETEX(`metas?product_id=${product_id}`, EXPIRATION, JSON.stringify(data));
          res.status(200).json(data);
        }
      })
      .catch(error => {
        console.error(error.stack);
        res.status(404).send(error.stack);
      })

    // db.getMetaData(req.query, data)
    //   .then(() => {
    //     res.status(200).json(data);
    //   })
    //   .catch(error => {
    //     console.log(error.stack);
    //     res.status(404).send(error.stack);
    //   })
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

  app.get('/loaderio-2e0157ab1bba94790821803b197e858b.txt', (req, res) => {
    res.sendFile(`${__dirname}/loaderio-2e0157ab1bba94790821803b197e858b.txt`)
  })

  return app;
}

