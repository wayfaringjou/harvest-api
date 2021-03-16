const express = require('express');
const path = require('path');
const Plant = require('./plants-service');

const plantsRouter = express.Router();

plantsRouter
  .route('/')
  .get(async (req, res) => {
    let plants;
    if (req.query.area_id) {
      plants = await Plant.getWithAreaQuery(
        req.app.get('db'),
        res.locals.garden_id,
        req.query.area_id,
      );
    } else {
      plants = await Plant.getByRelation(
        req.app.get('db'),
        'garden_id',
        res.locals.garden_id,
      );
    }

    res.status(200).json(plants.map(Plant.serialize));
  });

plantsRouter
  .route('/')
  .post(async (req, res) => {
    const {
      name,
      garden_id,
      area_id,
      image_url,
      scientific_name,
      sowing,
      light,
      days_to_harvest,
      row_spacing,
      spread,
      fruit_months,
      images,
      treflePath,
      gbifSpeciesKey,
    } = req.body;

    const newPlant = Plant.serialize({
      name,
      garden_id,
      area_id: area_id || null,
      image_url,
      scientific_name,
      sowing,
      light: light || null,
      days_to_harvest: days_to_harvest || null,
      row_spacing: row_spacing || null,
      spread: spread || null,
      fruit_months,
      images,
      treflePath,
      gbifspecieskey: gbifSpeciesKey || null,
    });

    const [response] = await Plant.insert(
      req.app.get('db'),
      newPlant,
    );

    res
      .status(200)
      .location(path.posix.join(req.originalUrl, `/${response.id}`))
      .json(response);
  });

plantsRouter.route('/:plantId')
  .get(async (req, res) => {
    const [plant] = await Plant.getById(
      req.app.get('db'),
      req.params.plantId,
    );
    if (!plant) {
      res.status(404).json('Plant with that id not found');
    } else {
      res.status(200)
        .json(Plant.serialize(plant));
    }
  })
  .delete(async (req, res) => {
    const [response] = await Plant.delete(
      req.app.get('db'),
      req.params.plantId,
    );
    res.status(200).json(response);
  })
  .patch(async (req, res) => {
    const updated = {};
    const serialized = Plant.serialize(req.body);
    // eslint-disable-next-line no-return-assign
    Object.keys(req.body).forEach((key) => updated[key] = serialized[key]);

    const [response] = await Plant.update(
      req.app.get('db'),
      req.params.plantId,
      updated,
    );
    res.status(200).json(response);
  });

module.exports = plantsRouter;
