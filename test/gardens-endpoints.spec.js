const knex = require('knex');
const request = require('supertest');
const app = require('../src/app');
/*
- Gardens should be accesible only by their user's id to a signed in user.

- For now each user will have one garden, so posting a garden will be done
by the client on user creation
*/

describe('Garden endpoints', () => {
  let db;

  before('Connect to db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
    console.log('Connected to db');
  });

  after('disconnect from db', () => db.destroy());

  // const res = await request(app).get('/api/gardens/1/areas')
  // expect(res.status).to.eql(200);
  // expect(res.body).to.eql([]);
  describe('GET /api/gardens/:gardenId/areas', () => {
    context('Given no areas', () => {
      it('responds with 200 and an empty list', () => (
        request(app).get('/api/gardens/1/areas')
          .expect(200, [])
      ));
    });
  });
});
