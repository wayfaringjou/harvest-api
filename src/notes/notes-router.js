const express = require('express');
const path = require('path');
const Note = require('./notes-service');

const notesRouter = express.Router();

notesRouter
  .route('/')
  .get(async (req, res) => {
    let notes;

    if (req.query.area_id) {
      notes = await Note.getWithAreaQuery(
        req.app.get('db'),
        res.locals.user_id,
        req.query.area_id,
      );
    } else if (req.query.plant_id) {
      notes = await Note.getWithPlantQuery(
        req.app.get('db'),
        res.locals.user_id,
        req.query.area_id,
      );
    } else if (req.query.garden_id) {
      notes = await Note.getWithGardenQuery(
        req.app.get('db'),
        res.locals.user_id,
        req.query.garden_id,
      );
    } else {
      notes = await Note.getByRelation(
        req.app.get('db'),
        'user_id',
        res.locals.user_id,
      );
    }

    res.status(200).json(notes.map(Note.serialize));
  })
  .post(express.json(), async (req, res, next) => {
    const {
      user_id, garden_id, area_id, plant_id, content, title,
    } = req.body;
    const newNote = Note.serialize({
      user_id, garden_id, area_id, plant_id, content, title,
    });

    try {
      const [response] = await Note.insert(
        req.app.get('db'),
        newNote,
      );

      res
        .status(200)
        .location(path.posix.join(req.originalUrl, `/${response.id}`))
        .json(response);
    } catch (error) {
      next(error);
    }
  });

notesRouter
  .route('/:noteId')
  .get(async (req, res) => {
    const [note] = await Note.getById(
      req.app.get('db'),
      req.params.noteId,
    );

    if (!note) {
      res.status(404).json('Note with that id not found');
    } else {
      res.status(200)
        .json(Note.serialize(note));
    }
  })
  .delete(async (req, res) => {
    const [response] = await Note.delete(
      req.app.get('db'),
      req.params.noteId,
    );
    res.status(200).json(response);
  })
  .patch(async (req, res) => {
    const updated = {};
    const serialized = Note.serialize(req.body);
    // eslint-disable-next-line no-return-assign
    Object.keys(req.body).forEach((key) => updated[key] = serialized[key]);

    const [response] = await Note.update(
      req.app.get('db'),
      req.params.noteId,
      updated,
    );

    res.status(200).json(response);
  });

module.exports = notesRouter;
