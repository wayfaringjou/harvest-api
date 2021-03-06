ALTER TABLE plants
  ADD COLUMN image_url VARCHAR(180),
  ADD COLUMN scientific_name VARCHAR(120),
  ADD COLUMN sowing TEXT,
  ADD COLUMN light INTEGER,
  ADD COLUMN days_to_harvest INTEGER,
  ADD COLUMN row_spacing INTEGER,
  ADD COLUMN spread INTEGER,
  ADD COLUMN fruit_months TEXT,
  ADD COLUMN images JSONB,
  ADD COLUMN treflePath  VARCHAR(80),
  ADD COLUMN gbifSpeciesKey INTEGER;