const express = require('express');
const path = require('path');
const Garden = require('./gradens-service');

const gardensRouter = express.Router();

gardensRouter
  .route('/')
  .get(async (req, res) => {
    const gardens = await Garden.getWithUserId(
      req.app.get('db'),
      res.locals.user_id,
    );
    res.status(200).json(gardens.map(Garden.serialize));
  })
  .post(async (req, res) => {
    const {
      user_id, name,
    } = req.body;

    const newGarden = Garden.serialize({
      user_id, name,
    });

    const response = await Garden.insert(
      req.app.get('db'),
      newGarden,
    );

    res.status(200)
      .location(path.posix.join(req.originalUrl, `/${response.id}`))
      .json(response);
  });

gardensRouter
  .route('/:gardenId')
  .get(async (req, res, next) => {
    try {
      const [garden] = await Garden.getById(
        req.app.get('db'),
        req.params.gardenId,
      );

      if (!garden) {
        res.status(404).json('Garden with that id not found');
      } else {
        res.status(200)
          .json(Garden.serialize(garden));
      }
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res) => {
    const [response] = await Garden.delete(
      req.app.get('db'),
      req.params.gardenId,
    );
    res.status(200).json(response);
  })
  .patch(async (req, res) => {
    const knex = req.app.get('db');
    const [response] = await knex('gardens')
      .where('id', req.params.gardenId)
      .update(req.body)
      .returning('*');
    res.status(200).json(response);
  });

module.exports = gardensRouter;
