const xss = require('xss');

const Garden = {
  getWithUserId: (db, user_id) => (
    db.select('*').from('gardens')
      .where('user_id', user_id)
  ),
  getById: (db, garden_id) => (
    db.select('*').from('gardens')
      .where('garden_id', garden_id)
  ),
  insert: async (db, newGarden) => {
    const [inserted] = await db.insert(newGarden)
      .into('gardens')
      .returning('*');

    return Garden.getById(db, inserted.id);
  },
  serialize: (garden) => ({
    id: garden.id,
    user_id: garden.user_id,
    name: xss(garden.name),
  }),
};

module.exports = Garden;
