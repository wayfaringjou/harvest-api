require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  TREFLE_TOKEN: process.env.TREFLE_TOKEN,
};
