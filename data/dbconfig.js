const knex = require('knex');

const knexfile = require('../knexfile');

const db = require('../routes/userModel')

module.exports = knex(knexfile.development);