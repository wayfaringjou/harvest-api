const express = require('express');
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
    const knex = req.app.get('db');
    const { name } = req.body;
    const newPlant = {
      name,
    };
    const [response] = await knex.insert(newPlant)
      .into('plants')
      .returning('*');
    res
      .status(200)
      .location(`${req.originalUrl}/${response.id}`)
      .json(response);
  });

plantsRouter.route('/:plantId')
  .get(async (req, res) => {
    const knex = req.app.get('db');
    console.log(req.params.plantId);
    const [plant] = await knex.select('*').from('plants')
      .where('id', req.params.plantId);
    console.log(plant);
    res.status(200)
      .json(Plant.serialize(plant));
  })
  .delete(async (req, res) => {
    const knex = req.app.get('db');
    console.log(req.params.plantId);
    const [response] = await knex('plants')
      .where('id', req.params.plantId)
      .delete()
      .returning('*');
    console.log(response);
    res.status(200).json(response);
  })
  .patch(async (req, res) => {
    const knex = req.app.get('db');
    const [response] = await knex('plants')
      .where('id', req.params.plantId)
      .update(req.body)
      .returning('*');
    console.log(response);
    res.status(200).json(response);
  });

module.exports = plantsRouter;
