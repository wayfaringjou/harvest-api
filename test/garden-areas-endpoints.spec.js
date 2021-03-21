const knex = require('knex');
const request = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Garden areas endpoints', () => {
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
  describe('GET /api/gardens/:gardenId/areas', () => {
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
        request(app).get(`/api/gardens/${testGarden[0].id}/areas`)
          .expect(401)
      ));
    });
    context('Authenticated user request their garden areas', () => {
      it('responds with 200 and areas data', () => (
        request(app)
          .get(`/api/gardens/${testGarden[0].id}/areas`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            res.body.forEach((area, i) => {
              expect(area.user_name).to.eql(testAreas[i].user_name);
              expect(area.length_cm).to.eql(testAreas[i].length_cm || '');
              expect(area.width_cm).to.eql(testAreas[i].width_cm || '');
            });
          })
      ));
    });
  });
});
