const express = require('express');
const xss = require('xss');

const gardensRouter = express.Router();

const serializeGarden = (garden) => ({
  id: garden.id,
  user_id: garden.user_id,
  name: xss(garden.name),
});

gardensRouter
  .route('/')
  .get(async (req, res) => {
    const knex = req.app.get('db');
    const gardens = await knex.select('*').from('gardens')
      .where('user_id', res.locals.user_id);
    const parsedGardens = gardens.map(serializeGarden);
    console.log(res.locals.user_id);
    console.log(parsedGardens);
    console.log(req.user_id);
    res.status(200).json(parsedGardens);
  })
  .post(async (req, res) => {
    const knex = req.app.get('db');
    const {
      user_id, name,
    } = req.body;
    const newGarden = serializeGarden({
      user_id, name,
    });
    const [response] = await knex.insert(newGarden)
      .into('gardens')
      .returning('*');
    res
      .status(200)
      .location(`${req.originalUrl}/${response.id}`)
      .json(response);
  });

gardensRouter
  .route('/:gardenId')
  .get(async (req, res) => {
    const knex = req.app.get('db');
    const [garden] = await knex.select('*').from('gardens')
      .where('id', req.params.gardenId);
    res.status(200)
      .json(serializeGarden(garden));
  })
  .delete(async (req, res) => {
    const knex = req.app.get('db');
    console.log(req.params.gardenId);
    const [response] = await knex('gardens')
      .where('id', req.params.gardenId)
      .delete()
      .returning('*');
    console.log(response);
    res.status(200).json(response);
  })
  .patch(async (req, res) => {
    const knex = req.app.get('db');
    const [response] = await knex('gardens')
      .where('id', req.params.gardenId)
      .update(req.body)
      .returning('*');
    console.log(response);
    res.status(200).json(response);
  });

module.exports = gardensRouter;
