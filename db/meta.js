'use strict';

const mongodb = require('mongodb');
const Promise = require('bluebird');
const MongoClient = mongodb.MongoClient;

const config = require('../config');

let db;

Promise.resolve(MongoClient.connect(config.db.url))
  .then(mongo => db = mongo.db('ingest'))
  .tap(() => console.log('Connected to db', config.db.url))
  .catch(e => {
    console.log('Failed to connect to db', config.db.url);
    throw e;
  });

/**
 * Save metadata to db
 * @param {Object[]} meta An array of metadata of coins
 */
function saveMeta(meta) {
  return Promise.resolve(db.collection('coins').insertMany(meta))
    .tap(() => db.collection('coins').ensureIndex({ "Symbol": 1 }));
}

const result = {
  saveMeta
};

module.exports = result;