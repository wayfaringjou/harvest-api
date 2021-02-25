const knex = require('knex');
const app = require('./src/app');
const { PORT, DATABASE_URL } = require('./config');

app.set('db', knex({
  client: 'pg',
  connection: DATABASE_URL,
}));

app.listen(PORT, () => console.log(`Listening in port: ${PORT}`));
