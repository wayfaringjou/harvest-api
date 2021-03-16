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
  insert: async (db, newPlant) => {
    const [inserted] = await db.insert(newPlant)
      .into('plants')
      .returning('*');

    return Plant.getById(db, inserted.id);
  },
  serialize: (plant) => ({
    id: plant.id,
    name: xss(plant.name),
    garden_id: plant.garden_id,
    area_id: plant.area_id,
    image_url: xss(plant.image_url),
    scientific_name: xss(plant.scientific_name),
    sowing: xss(plant.sowing),
    light: plant.light,
    days_to_harvest: plant.days_to_harvest,
    row_spacing: plant.row_spacing,
    spread: plant.spread,
    fruit_months: xss(plant.fruit_months),
    images: plant.images,
    treflepath: plant.treflePath,
    gbifspecieskey: plant.gbifspecieskey,
  }),
};

module.exports = Plant;
