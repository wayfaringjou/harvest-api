ALTER TABLE plants
  ADD COLUMN
    area_id INTEGER REFERENCES garden_areas(id)
    ON DELETE SET NULL;