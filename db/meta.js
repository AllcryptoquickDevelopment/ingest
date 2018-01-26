'use strict';

const Promise = require('bluebird');
const db = require('./db');

/**
 * Save metadata to db
 * @param {Object[]} meta An array of metadata of coins
 */
function saveMeta(meta) {
  return Promise.resolve(db.db.collection('coins').insertMany(meta))
    .tap(() => db.db.collection('coins').ensureIndex({ "Symbol": 1 }));
}

const result = {
  saveMeta
};

module.exports = result;