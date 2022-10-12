const model = require('../index.js');

module.exports.getReviews = (req, res) => {
  let { page = 1, count = 5 , sort = 'relevant' , product_id } = req.query;

  let data = {
    product: product_id,
    page: page - 1,
    count
  }

  return model.queryAsync(`SELECT id,
                                  rating,
                                  created_at,
                                  summary,
                                  body,
                                  recommend,
                                  reviewer_name,
                                  reviewer_email,
                                  response,
                                  helpfulness
                            FROM reviews WHERE product_id = ${product_id}
                            LIMIT ${count}`)
    .then(result => {
      data.results = result.rows;

      let promises = data.results.map(review => {
        return model.queryAsync(`SELECT id, photo_url FROM photos WHERE review_id = ${review.id}`)
          .then(photoData => {
            return review.photos = photoData.rows;
          })
      })
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

  // return model.queryAsync(`SELECT reviews.product_id, reviews.id, photos.photo_url
  //                          FROM reviews
  //                          LEFT JOIN photos
  //                          ON reviews.product_id = ${product_id}
  //                          AND reviews.id = photos.review_id
  //                          LIMIT ${10}`)
  //   .then(result => {
  //     console.log(result.rows);
  //     res.send(result.rows);
  //   })
  //   .catch(error => {
  //     console.log(error.stack);
  //     res.send(error.stack);
  //   })
}