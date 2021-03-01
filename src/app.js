require('dotenv').config();
const cors = require('cors');
const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger("combined"));
app.use(cors());

app.use(express.json());

app.route('/api/garden/areas')
  .get(async (req, res) => {
    const knex = req.app.get('db');
    const areas = await knex.select('*').from('garden_areas');
    console.log(areas);
    res.status(200).json(areas);
  });

module.exports = app;
