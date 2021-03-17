require('dotenv').config();

let config;

if (process.env.NODE_ENV === 'test') {
  config = {
    migrationsDirectory: 'migrations',
    driver: 'pg',
    connectionString: (process.env.NODE_ENV === 'test')
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
  };
} else {
  config = {
    migrationsDirectory: 'migrations',
    driver: 'pg',
    connectionString: (process.env.NODE_ENV === 'test')
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}
module.exports = config;
