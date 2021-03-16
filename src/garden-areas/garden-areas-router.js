const express = require('express');
const requireAuth = require('../../middleware/jwt-auth');
const Area = require('./garden-areas-service');

const areasRouter = express.Router();

areasRouter.route('/')
  .all(requireAuth)
  .get(async (req, res) => {
    const areas = await Area.getByRelation(
      req.app.get('db'),
      'garden_id',
      res.locals.garden_id,
    );
    res.status(200).json(areas.map(Area.serialize));
  })
  .post(async (req, res) => {
    const {
      name, length_cm, width_cm, garden_id,
    } = req.body;
    const newArea = {
      name,
      garden_id,
      length_cm: length_cm ? parseInt(length_cm, 10) : null,
      width_cm: width_cm ? parseInt(width_cm, 10) : null,
    };
    const [response] = await Area.insert(
      req.app.get('db'),
      newArea,
    );

    res
      .status(200)
      .location(`${req.originalUrl}/${response.id}`)
      .json(response);
  });

areasRouter.route('/:areaId')
  .all(requireAuth)
  .get(async (req, res) => {
    const [area] = await Area.getById(
      req.app.get('db'),
      req.params.areaId,
    );

    res.status(200)
      .json(Area.serialize(area));
  })
  .delete(async (req, res) => {
    const [response] = await Area.delete(
      req.app.get('db'),
      req.params.areaId,
    );

    res.status(200).json(response);
  })
  .patch(async (req, res) => {
    const updated = {};
    const serialized = Area.serialize(req.body);
    // eslint-disable-next-line no-return-assign
    Object.keys(req.body).forEach((key) => updated[key] = serialized[key]);

    const [response] = await Area.update(
      req.app.get('db'),
      req.params.areaId,
      updated,
    );

    res.status(200).json(response);
  });
module.exports = areasRouter;
