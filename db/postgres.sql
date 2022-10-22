CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date BIGINT DEFAULT to_char(NOW(), 'YYYY-MM-dd"T"HH:MM:SS.MS"Z"'),
  summary VARCHAR (256) NOT NULL,
  body VARCHAR (512) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR (50) NOT NULL,
  reviewer_email VARCHAR (50) NOT NULL,
  response VARCHAR (256),
  helpfulness INT DEFAULT 0
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
  review_id INT NOT NULL,
  value INT NOT NULL,
  FOREIGN KEY (characteristics_id)
    REFERENCES characteristics (id),
  FOREIGN KEY (review_id)
    REFERENCES reviews (id)
);

CREATE INDEX reviews_product_id_idx ON reviews (product_id);

CREATE INDEX photos_review_id_idx ON reviews (review_id);

CREATE INDEX cr_characteristics_id_idx ON characteristics_reviews (characteristics_id);

CREATE INDEX c_product_id_idx ON characteristics (product_id);


ALTER TABLE reviews ALTER COLUMN date TYPE varchar(30) USING to_char(to_timestamp(date / 1000), 'YYYY-MM-dd"T"HH:MM:SS.MS"Z"');

SELECT setval('reviews_id_seq'::regclass, (SELECT MAX(id) FROM reviews));

SELECT setval('photos_id_seq'::regclass, (SELECT MAX(id) FROM photos));






-- SELECT MAX(id) FROM reviews;
-- SELECT nextval('reviews_id_seq'::regclass);


-- ALTER TABLE reviews ALTER COLUMN date SET DEFAULT to_char(NOW(), 'YYYY-MM-dd"T"HH:MM:SS.MS"Z"');

-- ALTER TABLE reviews ALTER COLUMN helpfulness SET DEFAULT 0;

-- ALTER TABLE reviews ALTER COLUMN response drop not null;


-- \copy reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
-- FROM '/Users/ethanayaay/Documents/CSV/SDC/reviews.csv'
-- DELIMITER ','
-- CSV HEADER

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




