const model = require('../index.js');

module.exports.getReviews = ({page = 1, count = 5, sort, product_id}) => {
  let sortQuery = 'ORDER BY review_id ASC'

  if (sort === "'helpful'" || sort === 'helpful') {
    sortQuery = 'ORDER BY helpfulness DESC';
  } else if (sort === "'newest'" || sort === 'newest') {
    sortQuery = 'ORDER BY date DESC';
  } else if ( sort === "'relevant'" || sort === 'relevant' ) {
    sortQuery = 'ORDER BY helpfulness DESC, date DESC'
  }

  // ARRAY_TO_JSON(ARRAY_REMOVE(ARRAY_AGG(), NULL)) AS photos

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
                                  COALESCE(JSON_AGG(JSON_BUILD_OBJECT(
                                    'id', id,
                                    'url', url
                                  )) FILTER (WHERE url IS NOT NULL), '[]'::json) AS photos
                            FROM reviews AS r
                            LEFT JOIN photos USING (review_id)
                            WHERE product_id = ${product_id}
                            AND reported = false
                            GROUP BY review_id
                            ${sortQuery}
                            LIMIT ${count}
                            OFFSET ${page * count - count}`)
};

module.exports.getMetaData = ({product_id}, data) => {
  //count all ratings
  return model.queryAsync(`SELECT COUNT(review_id),
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
};

module.exports.postReview = (req) => {
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
  return model.queryAsync(insertReviewQuery)
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
};

module.exports.markHelpful = ({review_id}) => {
  return model.queryAsync(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${review_id}`)
};

module.exports.reportReview = ({review_id}) => {
  return model.queryAsync(`UPDATE reviews SET reported = true WHERE review_id = ${review_id}`)
};