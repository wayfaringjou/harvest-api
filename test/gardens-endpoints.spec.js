const knex = require('knex');
const request = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

/*
- Gardens should be accesible only by their user's id to a signed in user.

- For now each user will have one garden, so posting a garden will be done
by the client on user creation
*/

describe('Garden endpoints', () => {
  let db;

  const {
    testUsers,
    testGarden,
    testPlants,
    testAreas,
    testNotes,
  } = helpers.makeFixtures();

  before('Connect to db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  afterEach('cleanup', () => helpers.cleanTables(db));
  // const res = await request(app).get('/api/gardens/1/areas')
  // expect(res.status).to.eql(200);
  // expect(res.body).to.eql([]);
  describe('GET /api/users/:userId/gardens', () => {
    beforeEach('insert data', () => (
      helpers.seedTables(
        db,
        testUsers,
        testGarden,
        testAreas,
        testPlants,
        testNotes,
      )
    ));

    context('Given no authentication', () => {
      it('responds with 401', () => (
        request(app).get(`/api/users/${testUsers[0].id}/gardens`)
          .expect(401)
      ));
    });
    context('Authenticated user request their garden', () => {
      it('responds with 200 and garden data', () => (
        request(app)
          .get(`/api/users/${testUsers[0].id}/gardens`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body).to.eql(testGarden);
          })
      ));
    });
  });
});
