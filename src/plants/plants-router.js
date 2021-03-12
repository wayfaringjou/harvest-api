const express = require('express');
const xss = require('xss');

const plantsRouter = express.Router();

const serializePlant = (plant) => ({
  id: plant.id,
  name: xss(plant.name),
  garden_id: plant.garden_id,
  area_id: plant.area_id,
});

plantsRouter
  .route('/')
  .get(async (req, res) => {
    const knex = req.app.get('db');
    let plants;
    console.log('We are here!!!!!!!');
    console.log(req.query);
    if (req.query.area_id) {
      plants = await knex.select('*').from('plants')
        .where('garden_id', res.locals.garden_id)
        .where('area_id', req.query.area_id);
    } else {
      plants = await knex.select('*').from('plants')
        .where('garden_id', res.locals.garden_id);
    }
    const parsedPlants = plants.map(serializePlant);
    // console.log(parsedPlants);
    console.log('****');
    res.status(200).json(parsedPlants);
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
      .json(serializePlant(plant));
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
