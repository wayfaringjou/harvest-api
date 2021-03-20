const express = require('express');
const fetch = require('node-fetch');
const { CLIENT_ORIGIN, TREFLE_TOKEN } = require('../../config');

const trefleRouter = express.Router();

trefleRouter.route('/')
  .get(async (req, res) => {
    // The parameters for our POST request
    const params = {
      origin: CLIENT_ORIGIN,
      // origin: 'http://localhost:3000',
      // ip: 'THE-WEBSITE-USER-IP',
      token: TREFLE_TOKEN,
    };
    const response = await fetch(
      'https://trefle.io/api/auth/claim', {
        method: 'post',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const json = await response.json();
    res.status(200).json(json);
  });

module.exports = trefleRouter;
