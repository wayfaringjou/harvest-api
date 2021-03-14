const xss = require('xss');
const commonMethods = require('../common/CommonMethods');

const plantsCommonMethods = commonMethods('plants');

const Plant = {
  ...plantsCommonMethods,
  getWithAreaQuery: (db, garden_id, area_id) => (
    db.select('*').from('plants')
      .where('garden_id', garden_id)
      .where('area_id', area_id)
  ),
  serialize: (plant) => ({
    id: plant.id,
    name: xss(plant.name),
    garden_id: plant.garden_id,
    area_id: plant.area_id,
  }),
};

module.exports = Plant;
