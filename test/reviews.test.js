const makeApp = require('../server/app.js');
const db = require('../db/controllers/controllers.js');
const request = require('supertest');

const mockDB = {
  getReviews: jest.fn(),
  getMetaData: jest.fn(),
  postReview: jest.fn(),
  markHelpful: jest.fn(),
  reportReview: jest.fn()
}

const app = makeApp(mockDB);

describe('First Test', () => {
  it ("Should add values", () => {
    expect(1 + 1).toBe(2);
  })
})

describe('GET /reviews', () => {
  it ("Should respond with a 200 status code", async () => {
    const response = await request(app).get('/reviews/?product_id=1');

    expect(response.statusCode).toBe(200);
  })

  it ("Should respond with a 404 if no product id is specified", async () => {
    const response = await request(app).get('/reviews');

    expect(response.statusCode).toBe(404)
  })

  it ("Should contain appropriate fields", async () => {
    const response = await request(app).get('/reviews/?product_id=1');

    const expected = {
      review_id: 2,
      rating: 4,
      date: "2021-01-08T11:01:13.000Z",
      summary: "This product was ok!",
      body: "I really did not like this product solely because I am tiny and do not fit into it.",
      recommend: false,
      reviewer_name: "mymainstreammother",
      reviewer_email: "first.last@gmail.com",
      response: "null",
      helpfulness: 2,
      photos: []
  }

    expect(response.body.product).toBe('1');
    expect(response.body.results[0]).toMatchObject(expected);
  })
})

describe('POST /reviews', () => {
  it ("Should respond with a 200 status code on successful POST", async () => {
    const response = await request(app).post('/reviews').send({
      product_id: 1,
      rating: 3,
      summary: 'test summary',
      body: 'test body',
      recommend: true,
      name: 'ethan',
      email: 'email@email.com',
      photos: [],
      characteristics: {
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4
      }
    })

    expect(response.statusCode).toBe(200);
  })

  it ("Should respond with a 400 status code if any fields are missing", () => {
    let postData = {
      product_id: 1,
      rating: 3,
      summary: 'test summary',
      body: 'test body',
      recommend: true,
      name: 'ethan',
      email: 'email@email.com',
      photos: [],
      characteristics: {
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4
      }
    }

    let keys = Object.keys(postData);

    keys.forEach(async (key) => {
      let temp = postData[key];
      delete postData[key]
      const response = await request(app).post('/reviews').send(postData)
      expect(response.statusCode).toBe(400);
      postData[key] = temp;
    })
  })
})

describe('PUT /reviews/helpful', () => {
  it ("Should return a 200 status code on successful PUT", async () => {
    const response = await request(app).put('/reviews/1/helpful');

    expect(response.statusCode).toBe(200);
  })
})


describe('PUT /reviews/report', () => {
  it ("Should return a 200 status code on successful PUT", async () => {
    const response = await request(app).put('/reviews/1/report');

    expect(response.statusCode).toBe(200);
  })
})


