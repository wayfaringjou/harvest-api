CREATE TABLE garden_areas (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name VARCHAR(240) NOT NULL,
  length_cm INTEGER,
  width_cm INTEGER
);