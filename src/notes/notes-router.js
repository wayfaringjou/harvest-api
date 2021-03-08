const express = require('express');
const xss = require('xss');

const notesRouter = express.Router();

const serializeNote = (note) => ({
  id: note.id,
  user_id: note.user_id,
  garden_id: note.garden_id,
  area_id: note.area_id,
  plant_id: note.plant_id,
  content: xss(note.content),
  title: xss(note.title),
});

notesRouter
  .route('/')
  .get(async (req, res) => {
    const knex = req.app.get('db');
    const notes = await knex.select('*').from('notes');
    const parsedNotes = notes.map(serializeNote);
    console.log(parsedNotes);
    res.status(200).json(parsedNotes);
  })
  .post(async (req, res) => {
    const knex = req.app.get('db');
    const {
      user_id, garden_id, area_id, plant_id, content, title,
    } = req.body;
    const newNote = serializeNote({
      user_id, garden_id, area_id, plant_id, content, title,
    });
    const [response] = await knex.insert(newNote)
      .into('notes')
      .returning('*');
    res
      .status(200)
      .location(`${req.originalUrl}/${response.id}`)
      .json(response);
  });

notesRouter
  .route('/:noteId')
  .get(async (req, res) => {
    const knex = req.app.get('db');
    const [note] = await knex.select('*').from('notes')
      .where('id', req.params.noteId);
    res.status(200)
      .json(serializeNote(note));
  })
  .delete(async (req, res) => {
    const knex = req.app.get('db');
    console.log(req.params.noteId);
    const [response] = await knex('notes')
      .where('id', req.params.noteId)
      .delete()
      .returning('*');
    console.log(response);
    res.status(200).json(response);
  })
  .patch(async (req, res) => {
    const knex = req.app.get('db');
    const [response] = await knex('notes')
      .where('id', req.params.noteId)
      .update(req.body)
      .returning('*');
    console.log(response);
    res.status(200).json(response);
  });

module.exports = notesRouter;
