const knex = require('knex');
const request = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Garden notes endpoints', () => {
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
  describe('GET /api/users/:userId/garden/notes', () => {
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
        request(app).get(`/api/users/${testUsers[0].id}/garden/notes`)
          .expect(401)
      ));
    });
    context('Authenticated user request their notes', () => {
      it('responds with 200 and notes data', () => (
        request(app)
          .get(`/api/users/${testUsers[0].id}/garden/notes`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            res.body.forEach((note, i) => {
              expect(note.user_id).to.eql(testNotes[i].user_id);
              expect(note.garden_id).to.eql(testNotes[i].garden_id);
              expect(note.plant_id).to.eql(testNotes[i].plant_id || '');
              expect(note.area_id).to.eql(testNotes[i].area_id || '');
              expect(note.area_id).to.eql(testNotes[i].area_id || '');
              expect(note.title).to.eql(testNotes[i].title);
              expect(note.content).to.eql(testNotes[i].content);
            });
          })
      ));
    });
  });
});
