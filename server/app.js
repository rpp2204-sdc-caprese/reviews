const makeApp = require('./index.js');
const db = require('../db/controllers/controllers.js');

const app = makeApp(db);

app.listen(3000, () => {
  console.log('App is listening on port 3000')
})