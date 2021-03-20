const { expect } = require('chai');
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
  });

  after('disconnect from db', () => db.destroy());

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /auth', () => {
    context('Given valid username and password', () => {
      const newUser = helpers.makeUsersArray()[0];

      it('creates a new user and returns info', () => (
        request(app)
          .post('/auth')
          .send(newUser)
          .expect(201)
          .expect((res) => {
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('date_created');
            expect(res.headers.location).to.eql(`/auth/${res.body.id}`);
          })
      ));
    });
  });
});
