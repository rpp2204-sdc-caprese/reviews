CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date BIGINT NOT NULL,
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
  url VARCHAR (256),
  FOREIGN KEY (review_id)
    REFERENCES reviews (review_id)
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
    REFERENCES reviews (review_id)
);
-- AFTER ETL

CREATE INDEX reviews_product_id_idx ON reviews (product_id);

CREATE INDEX photos_review_id_idx ON photos (review_id);

CREATE INDEX cr_characteristics_id_idx ON characteristics_reviews (characteristics_id);

CREATE INDEX c_product_id_idx ON characteristics (product_id);


ALTER TABLE reviews ALTER COLUMN date TYPE varchar(30) USING to_char(to_timestamp(date / 1000), 'YYYY-MM-dd"T"HH:MM:SS.MS"Z"');

SELECT setval('reviews_review_id_seq'::regclass, (SELECT MAX(review_id) FROM reviews));

SELECT setval('photos_id_seq'::regclass, (SELECT MAX(id) FROM photos));

SELECT setval('characteristics_reviews_id_seq'::regclass, (SELECT MAX(id) FROM characteristics_reviews));

ALTER TABLE reviews ALTER COLUMN date SET DEFAULT to_char(NOW(), 'YYYY-MM-dd"T"HH:MM:SS.MS"Z"');

-- ALTER TABLE photos RENAME COLUMN photo_url TO url;





-- SELECT MAX(id) FROM reviews;
-- SELECT nextval('reviews_id_seq'::regclass);



-- ALTER TABLE reviews ALTER COLUMN helpfulness SET DEFAULT 0;

-- ALTER TABLE reviews ALTER COLUMN response drop not null;


\copy reviews (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/home/ubuntu/reviews.csv'
DELIMITER ','
CSV HEADER;

\copy photos (id, review_id, photo_url)
FROM '/home/ubuntu/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

\copy characteristics (id, product_id, name)
FROM '/home/ubuntu/characteristics.csv'
DELIMITER ','
CSV HEADER;

\copy characteristics_reviews (id, characteristics_id, review_id, value)
FROM '/home/ubuntu/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

-- $ scp -i db.cer characteristic_reviews.csv ubuntu@ec2-184-73-20-153.compute-1.amazonaws.com:~/




