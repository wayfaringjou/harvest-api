require('dotenv').config();
const cors = require('cors');
const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger("combined"));
app.use(cors());

app.use(express.json());

app.route('/api/garden/areas')
  .post((req, res) => {
    console.log(req.body);
    res.status(404).json({ response: 'hello' });
  });

module.exports = app;
