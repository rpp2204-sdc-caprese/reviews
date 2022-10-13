const model = require('../index.js');

module.exports.getReviews = (req, res) => {
  //store variables
  let { page = 1, count = 5 , sort = 'relevant' , product_id } = req.query;

 //initialize data object
  let data = {
    product: product_id,
    page,
    count
  }

  //query all reviews for current product
  return model.queryAsync(`SELECT id,
                                  rating,
                                  date,
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
    ratings: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    recommended: {
      true: 0,
      false: 0
    },
    characteristics: {}
  }

  //query ratings and recommended from reviews table
  model.queryAsync(`SELECT id, rating, recommended FROM reviews WHERE product_id = ${product_id}`)
    .then(result => {
      let promises = result.rows.map(review => {
                      //increment ratings
                      data.ratings[review.rating]++
                      //increment recommendeds
                      data.recommended[review.recommended]++

                      //query for characteristics for each review
                      return model.queryAsync(`SELECT c.name, cr.value, cr.id
                                               FROM characteristics AS c
                                               INNER JOIN characteristics_reviews AS cr
                                               ON cr.characteristics_id = c.id
                                               AND cr.review_id = ${review.id}`)
                                  .then(charData => {
                                    console.log('data', charData.rows)

                                    //for each characteristic
                                    charData.rows.forEach(char => {
                                      //create data in obj
                                      if (!data.characteristics[char.name]) {
                                        data.characteristics[char.name] = {
                                          id: char.id,
                                          value: char.value
                                        } else {
                                          //somehow get calculate the average of the value and reasign
                                        }
                                      }
                                    })
                                  })
                    })
      return Promise.all(promises);
    })
    .then(result => {
      console.log('final data', data)
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error.stack);
      res.status(404).send(error.stack);
    })
};


