const makeApp = require('../server/app.js');
const db = require('../db/controllers/controllers.js');
const app = makeApp(db);
const request = require('supertest');


describe('First Test', () => {
  it ("Should add values", () => {
    expect(1 + 1).toBe(2);
  })
})

describe('GET /reviews', () => {
  it ("Should respond with a 200 status code", async () => {
    const response = await request(app).get('/reviews/?product_id=1');

    expect(response.statusCode).toBe(200)
  })

  it ("Should respond with a 404 if no product id is specified", async () => {
    const response = await request(app).get('/reviews');

    expect(response.statusCode).toBe(404)
  })

  it ("Should contain appropriate fields", async () => {
    const response = await request(app).get('/reviews/?product_id=1');

    const expected = {
      id: 1,
      rating: 5,
      created_at: '1596080481467',
      summary: 'This product was great!',
      body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
      recommend: true,
      reviewer_name: 'funtime',
      reviewer_email: 'first.last@gmail.com',
      response: 'null',
      helpfulness: 8
    }

    expect(response.body.product).toBe('1');
    expect(response.body.results[0]).toMatchObject(expected);
  })
})

