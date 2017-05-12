const Promise = require('bluebird');
const pgp = require('pg-promise')({promiseLib: Promise});
const db = pgp('postgres://leaflow:leaflow@db/leaflow');

module.exports = db;
