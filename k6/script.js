import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      duration: '60s',
      rate: 1000,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 50,
    }
  },
  thresholds: {
    http_req_failed: ['rate<1'],
    http_req_duration: ['p(95) < 2000']
  }
};

const reviews = "http://localhost:3000/reviews?product_id=1&sort='relevant'"
const metas = "http://localhost:3000/reviews/meta?product_id=5"
const post = "http://localhost:3000/reviews"

const payload = JSON.stringify({
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

const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default () => {
  http.get(reviews);

  // http.post(post, payload, params)
}

