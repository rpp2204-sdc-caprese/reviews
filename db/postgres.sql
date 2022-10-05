CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  created_at BIGINT NOT NULL,
  summary VARCHAR (256) NOT NULL,
  body VARCHAR (512) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR (50) NOT NULL,
  reviewer_email VARCHAR (50) NOT NULL,
  response VARCHAR (256),
  helpfulness INT
);

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  review_id INT NOT NULL,
  photo_url VARCHAR (256),
  FOREIGN KEY (review_id)
    REFERENCES reviews (id)
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR (12) NOT NULL
);

CREATE TABLE IF NOT EXISTS characteristics_reviews (
  id SERIAL PRIMARY KEY,
  characteristics_id INT NOT NULL,
  reviews_id INT NOT NULL,
  value INT NOT NULL,
  FOREIGN KEY (characteristics_id)
    REFERENCES characteristics (id),
  FOREIGN KEY (reviews_id)
    REFERENCES reviews (id)
);

-- \copy reviews (id, product_id, rating, created_at, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
-- FROM '/Users/ethanayaay/Documents/Code/Hack-Reactor/SDC/reviews/db/data/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- \copy photos (id, review_id, photo_url)
-- FROM '/Users/ethanayaay/Documents/Code/Hack-Reactor/SDC/reviews/db/data/reviews_photos.csv'
-- DELIMITER ','
-- CSV HEADER;

-- \copy characteristics (id, product_id, name)
-- FROM '/Users/ethanayaay/Documents/Code/Hack-Reactor/SDC/reviews/db/data/characteristics.csv'
-- DELIMITER ','
-- CSV HEADER;

-- \copy characteristics_reviews (id, characteristics_id, review_id, value)
-- FROM '/Users/ethanayaay/Documents/Code/Hack-Reactor/SDC/reviews/db/data/characteristic_reviews.csv'
-- DELIMITER ','
-- CSV HEADER;




