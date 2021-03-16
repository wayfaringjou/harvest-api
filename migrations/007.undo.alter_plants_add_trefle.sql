ALTER TABLE plants
  DROP COLUMN IF EXISTS image_url,
  DROP COLUMN IF EXISTS scientific_name,
  DROP COLUMN IF EXISTS sowing,
  DROP COLUMN IF EXISTS light,
  DROP COLUMN IF EXISTS days_to_harvest,
  DROP COLUMN IF EXISTS row_spacing,
  DROP COLUMN IF EXISTS spread,
  DROP COLUMN IF EXISTS fruit_months,
  DROP COLUMN IF EXISTS images,
  DROP COLUMN IF EXISTS treflePath,
  DROP COLUMN IF EXISTS gbifSpeciesKey;