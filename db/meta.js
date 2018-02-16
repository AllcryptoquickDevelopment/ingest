'use strict';

const Promise = require('bluebird');
const db = require('./db');

/**
 * Save metadata to db
 * @param {Object[]} meta An array of metadata of coins
 */
function saveMeta(meta) {
  if (!meta || meta.length === 0) {
    return Promise.resolve();
  }

  return Promise.resolve(db.db.collection('coins').insertMany(meta))
    .tap(() => db.db.collection('coins').ensureIndex({ "id": 1 }));
}

function getAllId() {
  return Promise.map(
    db.db.collection('coins').find().project({ id: 1, _id: 0 }).toArray(),
    meta => meta.id);
}

const result = {
  saveMeta,
  getAllId
};

module.exports = result;