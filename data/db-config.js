require('dotenv').config();
const knex = require('knex');
const dbConfig = process.env.DB_ENV || 'development';
const knexConfig = require('../knexfile')[dbConfig];
module.exports = knex(knexConfig);
