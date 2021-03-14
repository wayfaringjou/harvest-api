const xss = require('xss');
const commonMethods = require('../common/CommonMethods');

const areaCommonMethods = commonMethods('garden_areas');

const Area = {
  ...areaCommonMethods,
  insert: async (db, newArea) => {
    const [inserted] = await db.insert(newArea)
      .into('garden_areas')
      .returning('*');

    return Area.getById(db, inserted.id);
  },
  serialize: (area) => ({
    id: area.id,
    name: xss(area.name),
    length_cm: area.length_cm || '',
    width_cm: area.width_cm || '',
  }),
};

module.exports = Area;
