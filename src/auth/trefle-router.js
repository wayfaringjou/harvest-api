const express = require('express');
const fetch = require('node-fetch');

const trefleRouter = express.Router();

trefleRouter.route('/')
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

module.exports = trefleRouter;
