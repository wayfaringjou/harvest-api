const commonMethods = (dbstring) => ({
  getAll: (db) => (
    db.select('*').from(dbstring)
  ),
  getById: (db, id) => (
    db.select('*').from(dbstring)
      .where('id', id)
  ),
  getByRelation: (db, relationstring, id) => (
    db.select('*').from(dbstring)
      .where(relationstring, id)
  ),
  delete: (db, id) => (
    db(dbstring)
      .where('id', id)
      .delete()
      .returning('*')
  ),
  update: (db, id, data) => (
    db(dbstring)
      .where('id', id)
      .update(data)
      .returning('*')
  ),
});

module.exports = commonMethods;
