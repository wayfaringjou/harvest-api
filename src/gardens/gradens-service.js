const xss = require('xss');
const commonMethods = require('../common/CommonMethods');

const gardenCommonMethods = commonMethods('gardens');
const Garden = {
  ...gardenCommonMethods,
  getWithUserId: (db, user_id) => (
    db.select('*').from('gardens')
      .where('user_id', user_id)
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
