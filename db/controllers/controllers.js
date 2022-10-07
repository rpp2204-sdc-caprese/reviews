const model = require('../index.js');

module.exports.getReviews = (req, res) => {
  return model.queryAsync('SELECT * FROM reviews WHERE id = 1')
    .then(result => {
      res.json(result.rows);
    })
}