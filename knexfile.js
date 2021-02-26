var dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const PROD_DB = process.env.DATABASE_URL + '?sslmode=require'

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './data/migrations' },
    seeds: { directory: './data/seeds' },
    pool: {
      min: 2,
      max: 10,
    },
  },

  testing: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './data/migrations' },
    seeds: { directory: './data/seeds' },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: PROD_DB,
      ssl: { rejectUnauthorized: false },
    },
    migrations: { directory: './data/migrations' },
    seeds: { directory: './data/seeds' },
  },
};
