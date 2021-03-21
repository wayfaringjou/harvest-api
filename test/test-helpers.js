const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const makeUsersArray = () => ([
  {
    id: 1,
    user_name: 'test-user-1',
    password: 'Pas$w0rd',
    date_created: new Date('2021-01-22T16:28:32.615Z'),
  },
  {
    id: 2,
    user_name: 'test-user-2',
    password: 'Pas$w0rd',
    date_created: new Date('2021-01-22T16:28:32.615Z'),
  },
  {
    id: 3,
    user_name: 'test-user-3',
    password: 'Pas$w0rd',
    date_created: new Date('2021-01-22T16:28:32.615Z'),
  },
  {
    id: 4,
    user_name: 'test-user-4',
    password: 'Pas$w0rd',
    date_created: new Date('2021-01-22T16:28:32.615Z'),
  },
]);

const makeGarden = () => ([
  {
    id: 1,
    user_id: 1,
    name: 'Test-garden',
  },
]);

const makePlantsArray = () => ([
  {
    id: 1,
    name: 'Kitchen sage',
    garden_id: 1,
    area_id: 3,
    image_url: null,
    scientific_name: 'Salvia officinalis',
    sowing: null,
    light: 7,
    days_to_harvest: null,
    row_spacing: null,
    spread: null,
    fruit_months: '',
    images: {
      fruit: [
        {
          id: 3368075,
          copyright: 'Taken Oct 14, 2019 by Bobby Ivezic (cc-by-sa)',
          image_url: 'https://bs.plantnet.org/image/o/a5df1df2e7ce12fc70d4806e13c84afe1e4fa068',
        },
      ],
    },
    gbifspecieskey: null,
  },
  {
    id: 2,
    name: 'Radish',
    garden_id: 1,
    area_id: 4,
    image_url: null,
    scientific_name: '',
    sowing: null,
    light: 8,
    days_to_harvest: null,
    row_spacing: null,
    spread: null,
    fruit_months: '',
    images: {},
    gbifspecieskey: null,
  },
  {
    id: 3,
    name: 'Fava bean',
    garden_id: 1,
    area_id: 3,
    image_url: null,
    scientific_name: 'Vicia faba',
    sowing: null,
    light: 8,
    days_to_harvest: null,
    row_spacing: null,
    spread: null,
    fruit_months: '',
    images: {
      fruit: [
        {
          id: 3392233,
          copyright: 'Taken Jun 7, 2020 by alain bibi (cc-by-sa)',
          image_url: 'https://bs.plantnet.org/image/o/dd115bec7b979155fabcc9c346e8e0a77cd769c5',
        },
      ],
    },
    gbifspecieskey: null,
  },
  {
    id: 4,
    name: 'Kidney bean',
    garden_id: 1,
    area_id: 4,
    image_url: null,
    scientific_name: 'Phaseolus vulgaris',
    sowing: null,
    light: 8,
    days_to_harvest: null,
    row_spacing: null,
    spread: null,
    fruit_months: '',
    images: {
      fruit: [
        {
          id: 3310807,
          copyright: 'Taken Aug 17, 2019 by Janet Kramer-Ohl (cc-by-sa)',
          image_url: 'https://bs.plantnet.org/image/o/16d867c6eb4b5480f1e910b82ef89cadc17f3f44',
        },
      ],
    },
    gbifspecieskey: null,
  },
]);

const makeAreasArray = () => ([
  {
    id: 1,
    name: 'Pots table',
    length_cm: null,
    width_cm: null,
    garden_id: 1,
  },
  {
    id: 2,
    name: 'Raised bed with trellis north',
    length_cm: 55,
    width_cm: 238,
    garden_id: 1,
  },
  {
    id: 3,
    name: 'Raised bed with trellis south',
    length_cm: 55,
    width_cm: 238,
    garden_id: 1,
  },
  {
    id: 4,
    name: 'Frontyard Plot',
    length_cm: 200,
    width_cm: 230,
    garden_id: 1,
  },
]);

const makeNotesArray = () => ([
  {
    id: 11,
    user_id: 1,
    garden_id: 1,
    area_id: 2,
    plant_id: 1,
    content: '- Clean up the Garden Tools.\n- Take Inventory of Supplies.\n- Take a Peek at Your Garden and Flower Beds.\n- Divide Perennials.\n- Plant your Spring Cool Weather Seeds.\n- Start Seeds Indoor for Warm Weather Plants.',
    title: 'Chores',
  },
  {
    id: 8,
    user_id: 1,
    garden_id: 1,
    area_id: 2,
    plant_id: 2,
    content: '',
    title: 'Tomatoes care',
  },
]);

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testGarden = makeGarden();
  const testPlants = makePlantsArray();
  const testAreas = makeAreasArray();
  const testNotes = makeNotesArray();
  return {
    testUsers, testGarden, testPlants, testAreas, testNotes,
  };
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.into('users').insert(preppedUsers)
    .then(() => {
      // update the auto sequence to stay in sync
      db.raw(
        'SELECT setval(\'users_id_seq\', ?)',
        [users[users.length - 1].id],
      );
    });
}

function seedGarden(db, garden) {
  return db.into('gardens').insert(garden)
    .then(() => {
      // update the auto sequence to stay in sync
      db.raw(
        'SELECT setval(\'users_id_seq\', ?)',
        [garden[garden.length - 1].id],
      );
    });
}

function seedTables(db, users, garden, areas, plants, notes) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await seedGarden(trx, garden);
    await trx.into('garden_areas').insert(areas);
    // update the auto sequence to match the forced id values
    await trx.raw(
      'SELECT setval(\'garden_areas_id_seq\', ?)',
      [areas[areas.length - 1].id],
    );

    await trx.into('plants').insert(plants);
    await trx.raw(
      'SELECT setval(\'plants_id_seq\', ?)',
      [plants[plants.length - 1].id],
    );

    await trx.into('notes').insert(notes);
    await trx.raw(
      'SELECT setval(\'notes_id_seq\', ?)',
      [notes[notes.length - 1].id],
    );
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
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

module.exports = {
  makeUsersArray, cleanTables, makeAuthHeader, makeFixtures, seedTables,
};
