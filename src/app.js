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

module.exports = app;
