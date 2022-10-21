const model = require('../index.js');

module.exports.getReviews = (req, res) => {
  //store variables
  let { page = 1, count = 5 , sort = 'relevant' , product_id } = req.query;

 //initialize data object
  let data = {
    product: product_id,
    page: page,
    count
  }

  //query all reviews for current product
  return model.queryAsync(`SELECT id,
                                  rating,
                                  date,
                                  summary,
                                  body,
                                  recommended,
                                  reviewer_name,
                                  reviewer_email,
                                  response,
                                  helpfulness
                            FROM reviews
                            WHERE product_id = ${product_id}
                            AND reported = false
                            LIMIT ${count}
                            OFFSET ${page - 1}`)
    .then(result => {
      //store reviews in data object
      data.results = result.rows;

      //iterate through reviews and query corresponding photos
      let promises = data.results.map(review => {
        return model.queryAsync(`SELECT id, url FROM photos WHERE review_id = ${review.id}`)
          .then(photoData => {
            //assign to data object
            return review.photos = photoData.rows;
          })
      })
      //resolve all promises
      return Promise.all(promises)
    })
    .then(result => {
      console.log(data)
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error.stack);
      res.status(404).send(error.stack);
    })
}

module.exports.getMetaData = (req, res) => {
  let { product_id } = req.query;

  let data = {
    product_id,
    ratings: {},
    recommended: {},
    characteristics: {}
  }

  //count all ratings
  model.queryAsync(`SELECT COUNT(id), rating FROM reviews WHERE product_id = ${product_id} GROUP BY rating`)
    .then(result => {
      result.rows.forEach(x => {
        data.ratings[x.rating] = x.count;
      })
      //count recomendeds
      return model.queryAsync(`SELECT COUNT(id), recommended FROM reviews WHERE product_id = ${product_id} GROUP BY recommended`)
    })
    .then(result => {
      result.rows.forEach(x => {
        data.recommended[x.recommended] = x.count;
      })

      return model.queryAsync(`SELECT c.name, AVG(cr.value) FROM characteristics AS c INNER JOIN characteristics_reviews AS cr ON cr.characteristics_id = c.id AND c.product_id = ${product_id} GROUP BY c.name`)
    })
    .then(result => {
      result.rows.forEach(x => {
        data.characteristics[x.name] = x.avg;
      })
    })
    .then(() => {
      console.log('final data', data)
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error.stack);
      res.status(404).send(error.stack);
    })
};

module.exports.postReview = (req, res) => {
  let insertReviewQuery = {
    text: 'INSERT INTO reviews (product_id, rating, summary, body, recommended, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    values: Object.values(req.body)
  }
  // let values = Object.values(req.body)
  // let insertReview = `INSERT INTO reviews (product_id, rating, summary, body, recommended, reviewer_name, reviewer_email)
  //               VALUES ($1, $2, $3, $4, $5, $6, $7)`


  //insert new row into reviews
  // model.queryAsync(insertReviewQuery)

  //insert each photo url into photos table, with corresponding review ID

  //characteristic id???

  res.status(200).send(`Successfully posted review for product ${req.body.product_id}`);
}

module.exports.markHelpful = (req, res) => {
  let {review_id} = req.params;

  model.queryAsync(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review_id}`)
    .then(result => {
      res.status(200).send(`Marked review ${review_id} as helpful`);
    })
    .catch(error => {
      res.status(400).send(error.stack);
    })
}

module.exports.reportReview = (req, res) => {
  let {review_id} = req.params;

  model.queryAsync(`UPDATE reviews SET reported = true WHERE id = ${review_id}`)
  .then(result => {
    res.status(200).send(`Reported review ${review_id}`);
  })
  .catch(error => {
    res.status(400).send(error.stack);
  })
}



  // //query ratings and recommended from reviews table
  // model.queryAsync(`SELECT id, rating, recommended FROM reviews WHERE product_id = ${product_id}`)
  //   .then(result => {
  //     let promises = result.rows.map(review => {
  //                     //increment ratings
  //                     data.ratings[review.rating]++
  //                     //increment recommendeds
  //                     data.recommended[review.recommended]++

  //                     //query for characteristics for each review
  //                     return model.queryAsync(`SELECT c.name, cr.value, cr.id
  //                                              FROM characteristics AS c
  //                                              INNER JOIN characteristics_reviews AS cr
  //                                              ON cr.characteristics_id = c.id
  //                                              AND cr.review_id = ${review.id}`)
  //                                 .then(charData => {
  //                                   console.log('data', charData.rows)

  //                                   //for each characteristic
  //                                   charData.rows.forEach(char => {
  //                                     //create data in obj
  //                                     if (!data.characteristics[char.name]) {
  //                                       data.characteristics[char.name] = {
  //                                         id: char.id,
  //                                         value: char.value
  //                                       }
  //                                     } else {
  //                                       //somehow get calculate the average of the value and reasign
  //                                     }
  //                                   })
  //                                 })
  //                   })
  //     return Promise.all(promises);
  //   })

