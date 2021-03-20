const jwt = require('jsonwebtoken');

const makeUsersArray = () => ([
  {
    user_name: 'test-user-1',
    password: 'Pas$w0rd',
  },
  {
    user_name: 'test-user-2',
    password: 'Pas$w0rd',
  },
  {
    user_name: 'test-user-3',
    password: 'Pas$w0rd',
  },
  {
    user_name: 'test-user-4',
    password: 'Pas$w0rd',
  },
]);

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  console.log(secret);
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

const cleanTables = (db) => db.transaction((trx) => trx.raw(
  `TRUNCATE
  notes,
  plants,
  garden_areas,
  gardens,
  users
      `,
)
  .then(() => Promise.all([
    trx.raw('ALTER SEQUENCE notes_id_seq minvalue 0 START WITH 1'),
    trx.raw('ALTER SEQUENCE plants_id_seq minvalue 0 START WITH 1'),
    trx.raw('ALTER SEQUENCE garden_areas_id_seq minvalue 0 START WITH 1'),
    trx.raw('ALTER SEQUENCE gardens_id_seq minvalue 0 START WITH 1'),
    trx.raw('ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1'),
    trx.raw('SELECT setval(\'notes_id_seq\', 0)'),
    trx.raw('SELECT setval(\'plants_id_seq\', 0)'),
    trx.raw('SELECT setval(\'garden_areas_id_seq\', 0)'),
    trx.raw('SELECT setval(\'gardens_id_seq\', 0)'),
    trx.raw('SELECT setval(\'users_id_seq\', 0)'),
  ])));

module.exports = { makeUsersArray, cleanTables, makeAuthHeader };
