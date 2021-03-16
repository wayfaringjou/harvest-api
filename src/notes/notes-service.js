const xss = require('xss');
const commonMethods = require('../common/CommonMethods');

const notesCommonMethods = commonMethods('notes');

const Note = {
  ...notesCommonMethods,
  getWithAreaQuery: (db, user_id, area_id) => (
    db.select('*').from('notes')
      .where('user_id', user_id)
      .where('area_id', area_id)
  ),
  getWithPlantQuery: (db, user_id, plant_id) => (
    db.select('*').from('notes')
      .where('user_id', user_id)
      .where('area_id', plant_id)
  ),
  getWithGardenQuery: (db, user_id, garden_id) => (
    db.select('*').from('notes')
      .where('user_id', user_id)
      .where('garden_id', garden_id)
  ),
  insert: async (db, newNote) => {
    const [inserted] = await db.insert(newNote)
      .into('notes')
      .returning('*');

    return Note.getById(db, inserted.id);
  },
  serialize: (note) => ({
    id: note.id,
    user_id: note.user_id,
    garden_id: note.garden_id,
    area_id: note.area_id || null,
    plant_id: note.plant_id || null,
    content: xss(note.content),
    title: xss(note.title),
  }),
};

module.exports = Note;
