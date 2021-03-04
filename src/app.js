/* eslint-disable camelcase */
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const logger = require('morgan');
const xss = require('xss');

const app = express();

app.use(logger('combined'));
app.use(cors());

app.use(express.json());

app.use((req, res, next) => setTimeout(() => {
  console.log('Handling request');
  next();
}, 1000));

const serializeArea = (area) => ({
  id: area.id,
  name: xss(area.name),
  length_cm: area.length_cm || '',
  width_cm: area.width_cm || '',
});

app.route('/api/garden/areas')
  .get(async (req, res) => {
    const knex = req.app.get('db');
    const areas = await knex.select('*').from('garden_areas');
    // console.log(areas);
    const parsedAreas = areas.map(serializeArea);
    console.log(parsedAreas);
    res.status(200).json(parsedAreas);
  })
  .post(async (req, res) => {
    const knex = req.app.get('db');
    const { name, length_cm, width_cm } = req.body;
    const newArea = {
      name,
      length_cm: length_cm ? parseInt(length_cm, 10) : null,
      width_cm: width_cm ? parseInt(width_cm, 10) : null,
    };
    const [response] = await knex.insert(newArea)
      .into('garden_areas')
      .returning('*');
    res
      .status(200)
      .location(`${req.originalUrl}/${response.id}`)
      .json(response);
  });

app.route('/api/garden/areas/:areaId')
  .delete(async (req, res) => {
    const knex = req.app.get('db');
    console.log(req.params.areaId);
    const [response] = await knex('garden_areas')
      .where('id', req.params.areaId)
      .delete()
      .returning('*');
    console.log(response);
    res.status(200).json(response);
  })
  .patch(async (req, res) => {
    const knex = req.app.get('db');
    const [response] = await knex('garden_areas')
      .where('id', req.params.areaId)
      .update(req.body)
      .returning('*');
    console.log(response);
    res.status(200).json(response);
  });

const serializePlant = (plant) => ({
  id: plant.id,
  name: xss(plant.name),
});

app.route('/api/garden/plants')
  .get(async (req, res) => {
    const knex = req.app.get('db');
    const plants = await knex.select('*').from('plants');
    const parsedPlants = plants.map(serializePlant);
    console.log(parsedPlants);
    res.status(200).json(parsedPlants);
  })
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

app.route('/api/garden/plants/:plantId')
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

const fetch = require('node-fetch');

app.route('/auth/trefle')
  .get(async (req, res) => {
    // The parameters for our POST request
    const params = {
      origin: 'http://localhost:3000',
      // ip: 'THE-WEBSITE-USER-IP',
      token: 'rpSbG-As7QHC5sqn1E3-x-p7FjDXW82T250KmCGl3EE',
    };
    const response = await fetch(
      'https://trefle.io/api/auth/claim', {
        method: 'post',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const json = await response.json();
    console.log(json);
    res.status(200).json(json);
  });

module.exports = app;
