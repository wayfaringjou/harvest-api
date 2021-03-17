const knex = require('knex');
const request = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users endpoints', () => {
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

  // afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /auth/', () => {
    context('Given valid username and password', () => {
      const newUser = helpers.makeUsersArray()[0];
      console.log(newUser);

      it('creates a new user and returns info', () => (
        request(app)
          .post('/auth')
          .send(newUser)
          .expect(201, {})
      ));
      it("creates a new garden with user's id", () => (
        request(app)
          .get('/api/users/:userId/gardens')
          .set('Authorization', helpers.makeAuthHeader({ ...newUser, id: 1 }))
          .expect(200, {})
      ));
    });
  });
});
