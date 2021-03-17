const knex = require('knex');
const pg = require('pg');
const app = require('./src/app');
const { PORT, DATABASE_URL, NODE_ENV } = require('./config');

if (NODE_ENV === 'production') {
  pg.defaults.ssl = {
    rejectUnauthorized: false,
  };
}

app.set('db', knex({
  client: 'pg',
  connection: DATABASE_URL,
}));

app.listen(PORT, () => {
  // console.log(`Listening in port: ${PORT}`);
});
