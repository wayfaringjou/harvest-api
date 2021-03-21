const knex = require('knex');
const request = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Garden plants endpoints', () => {
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
  describe('GET /api/gardens/:gardenId/plants', () => {
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
        request(app).get(`/api/gardens/${testGarden[0].id}/plants`)
          .expect(401)
      ));
    });
    context('Authenticated user request their garden plants', () => {
      it('responds with 200 and areas data', () => (
        request(app)
          .get(`/api/gardens/${testGarden[0].id}/plants`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            res.body.forEach((plant, i) => {
              expect(plant).to.eql({
                ...plant,
                image_url: testPlants[i].image_url || '',
                sowing: testPlants[i].sowing || '',
              });
            });
          })
      ));
    });
  });
});
