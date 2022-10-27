const model = require('../index.js');

module.exports.getReviews = (req, res) => {
  //store variables
  let { page = 1, count = 5 , sort, product_id } = req.query;

  let sortQuery = ''

  if (sort === "'helpful'" || sort === 'helpful') {
    sortQuery = 'ORDER BY helpfulness DESC';
  } else if (sort === "'newest'" || sort === 'newest') {
    sortQuery = 'ORDER BY date DESC';
  } else {
    sortQuery = 'ORDER BY helpfulness DESC, date DESC'
  }

 //initialize data object
  let data = {
    product: product_id,
    page: page * count - count,
    count
  }

  //query all reviews for current product
  return model.queryAsync(`SELECT review_id,
                                  rating,
                                  date,
                                  summary,
                                  body,
                                  recommend,
                                  reviewer_name,
                                  reviewer_email,
                                  response,
                                  helpfulness,
                                  ARRAY_REMOVE(ARRAY_AGG(url), NULL) AS photos
                            FROM reviews AS r
                            LEFT JOIN photos USING (review_id)
                            WHERE product_id = ${product_id}
                            AND reported = false
                            GROUP BY review_id
                            ${sortQuery}
                            LIMIT ${count}
                            OFFSET ${page * count - count}`)
    .then(result => {
      data.result = result.rows;
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error.stack);
      res.status(404).send(error.stack);
    })
};

module.exports.getMetaData = (req, res) => {
  let { product_id } = req.query;

  let data = {
    product_id,
    ratings: {},
    recommended: {},
    characteristics: {}
  }

  //count all ratings
  model.queryAsync(`SELECT COUNT(review_id),
                         rating
                    FROM reviews
                    WHERE product_id = ${product_id}
                    GROUP BY rating`)
    .then(result => {
      result.rows.forEach(x => {
        data.ratings[x.rating] = x.count;
      })
      //count recomendeds
      return model.queryAsync(`SELECT COUNT(review_id),
                                      recommend
                               FROM reviews
                               WHERE product_id = ${product_id}
                               GROUP BY recommend`)
    })
    .then(result => {
      result.rows.forEach(x => {
        data.recommended[x.recommend] = x.count;
      })
      //return avg of each characteristic for current product
      return model.queryAsync(`SELECT c.id,
                                      c.name,
                                      AVG(cr.value)
                                FROM characteristics AS c
                                INNER JOIN characteristics_reviews AS cr
                                ON cr.characteristics_id = c.id
                                AND c.product_id = ${product_id}
                                GROUP BY c.id, c.name
                                ORDER BY c.id ASC`)
    })
    .then(result => {
      result.rows.forEach(x => {
        data.characteristics[x.name] = {
          id: x.id,
          value: x.avg
        }
      })
    })
    .then(() => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error.stack);
      res.status(404).send(error.stack);
    })
};

module.exports.postReview = (req, res) => {

  let review_id;
  //insert review query object
  let insertReviewQuery = {
    text: 'INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING review_id',
    values: Object.values(req.body).splice(0, 7)
  }
  //insert photo query
  let insertPhotoQuery = 'INSERT INTO photos (review_id, url) VALUES ($1, $2)';

  //insert characteristic query
  let insertCharQuery = 'INSERT INTO characteristics_reviews (characteristics_id, review_id, value) VALUES ($1, $2, $3)'

  // insert new row into reviews
  model.queryAsync(insertReviewQuery)
    .then(result => {
      //insert each photo url into photos table, with corresponding review ID
      review_id = result.rows[0].review_id;

      let promises = req.body.photos.map(url => {
        let values = [ review_id, url ]
        return model.queryAsync(insertPhotoQuery, values);
      })

      return Promise.all(promises);
    })
    .then(() => {
      let promises = Object.keys(req.body.characteristics).map(char_id => {
        let charValue = req.body.characteristics[char_id]
        let values = [ char_id, review_id, charValue]

        return model.queryAsync(insertCharQuery, values);
      })

      return Promise.all(promises);
    })
    .then(result => {
      res.status(200).send(`Successfully posted review for product ${req.body.product_id}`);
    })
    .catch(error => {
      res.status(400).send(error.stack);
    })
};

module.exports.markHelpful = (req, res) => {
  let {review_id} = req.params;

  model.queryAsync(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${review_id}`)
    .then(result => {
      res.status(200).send(`Marked review ${review_id} as helpful`);
    })
    .catch(error => {
      res.status(400).send(error.stack);
    })
};

module.exports.reportReview = (req, res) => {
  let {review_id} = req.params;

  model.queryAsync(`UPDATE reviews SET reported = true WHERE review_id = ${review_id}`)
  .then(result => {
    res.status(200).send(`Reported review ${review_id}`);
  })
  .catch(error => {
    res.status(400).send(error.stack);
  })
};



    // .then(result => {
    //   //store reviews in data object
    //   data.results = result.rows;

    //   //iterate through reviews and query corresponding photos
    //   let promises = data.results.map(review => {
    //     return model.queryAsync(`SELECT id,
    //                                     url
    //                              FROM photos
    //                              WHERE review_id = ${review.review_id}`)
    //       .then(photoData => {
    //         //assign to data object
    //         return review.photos = photoData.rows;
    //       })
    //   })
    //   //resolve all promises
    //   return Promise.all(promises)
    // })

    `SELECT review_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, response, helpfulness, ARRAY(
                                    SELECT url
                                    FROM photos AS p
                                    WHERE p.review_id = r.review_id
                                  ) AS photos
                            FROM reviews AS r
                            WHERE product_id = 4
                            AND reported = false
                            ORDER BY helpfulness DESC
                            LIMIT 5
                            OFFSET 0`